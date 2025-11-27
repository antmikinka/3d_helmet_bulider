import { GoogleGenAI } from "@google/genai";
import { HelmetMeasurements, HelmetStyle } from "../types";

const getSystemInstruction = () => `
You are an expert CAD engineer and Python developer specializing in the Autodesk Fusion 360 API (adsk.core, adsk.fusion).

## CORE OBJECTIVE:
Generate a Python script that creates a FULLY EDITABLE, PARAMETRIC helmet base model.
The user does NOT want a static mesh. They want a "Living Design" with a clean Timeline history.

## CRITICAL RULES FOR FUSION 360 API:
1. **User Parameters First**: Start by creating 'UserParameters' for ALL measurements and design variables.
2. **Parametric Sketches**: 
   - Draw sketches on standard planes (XY, YZ, XZ).
   - Link dimensions to UserParameters: \`dim.parameter.expression = 'HeadWidth'\`
3. **Geometry Creation Types (CRITICAL FIX)**:
   - When using \`.add()\` methods for geometry (like \`sketchEllipses.add\` or \`sketchLines.add\`), you MUST pass \`adsk.core.Point3D\` objects.
   - **NEVER** pass \`adsk.fusion.SketchPoint\` objects to these \`.add()\` methods. The API will throw a TypeError.
   - Example CORRECT: \`ell = sketch.sketchCurves.sketchEllipses.add(adsk.core.Point3D.create(0,0,0), ...)\`
   - Example WRONG: \`ell = sketch.sketchCurves.sketchEllipses.add(someSketchPoint, ...)\`

4. **Preferred Geometry**: 
   - **USE SPLINES OVER ELLIPSES**: For the main head profiles, use \`sketchCurves.sketchFittedSplines.add(pointsCollection)\`.
   - Why? It is much easier to create 4 specific SketchPoints (Front, Back, Left, Right), add dimensions to those points, and then fit a spline through them. This guarantees the shape is fully parametric and editable.
   - Ellipses are very difficult to constrain parametrically via the API.

5. **Named Entities**: 
   - \`sketch.name = "Main Profile"\`
   - \`extrudeFeat.name = "Helmet Shell"\`

6. **Stabilization Poles**:
   - If enabled, create these as NEW BODIES.
   - Use simple Extrusions of circles on the inside surface, or a pattern of cylinders.

## CODE STRUCTURE:
- Imports: \`import adsk.core, adsk.fusion, traceback, math\`
- \`run(context)\` entry point.
- Wrap all logic in \`try: ... except: ... traceback.print_exc()\`
- End with \`ui.messageBox('Helmet Generated Successfully')\`
`;

export const generateFusionScript = async (
  measurements: HelmetMeasurements,
  style: HelmetStyle,
  additionalNotes: string,
  enableStabilization: boolean,
  standOffHeight: number,
  shellThickness: number
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Generate a Python script for Autodesk Fusion 360.
    
    ## Project: Custom Fitted Helmet (Parametric Base Model)
    ## Style: ${style}
    
    ## Measurements (Input Data):
    - Head Circumference: ${measurements.headCircumference} cm
    - Head Length: ${measurements.headLength} cm
    - Head Width: ${measurements.headWidth} cm
    - Face Length: ${measurements.faceLength} cm
    - Face Width: ${measurements.faceWidth} cm
    - Neck Circumference: ${measurements.neckCircumference} cm
    - Neck to Chin: ${measurements.neckToChin} cm
    
    ## Design Parameters (UserParameters):
    - ShellThickness: ${shellThickness} mm
    - StandOff: ${standOffHeight} cm
    - HeadLength, HeadWidth, etc.

    ## Implementation Steps:
    1. **Setup**: Initialize app, design, root component.
    2. **Parameters**: Create UserParameters for all input measurements.
    3. **Main Geometry (The Shell)**:
       - **YZ Plane Sketch (Side Profile)**: Create 4 SketchPoints (Top, Front, Back, Neck). Dimension them to \`HeadLength/2\`, \`FaceLength\`, etc. Connect with a \`FittedSpline\`.
       - **XZ Plane Sketch (Top Profile)**: Create SketchPoints for Width. Dimension to \`HeadWidth/2\`. Connect with Spline.
       - **Surface**: Use **Loft** (Surface) or **Revolve** (if simplified) to create the basic head form.
       - **Thicken**: Convert surface to solid using \`ThickenFeature\`, thickness = 'ShellThickness'.
    
    ${enableStabilization ? `
    4. **Stabilization System**:
       - Create a new Sketch on the inside of the shell (or offset plane).
       - Draw circles for "Poles".
       - Extrude them *inwards* by distance 'StandOff'.
       - Operation: New Body.
    ` : ''}

    5. **Final Polish**:
       - Ensure all Sketches and Bodies are named.
       - IMPORTANT: Do NOT use \`SketchEllipse\` if possible. Use Splines through constrained points to avoid API errors and ensure editability.
    
    6. **Output**: Return ONLY the raw Python code.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(),
        temperature: 0.2, 
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });

    let text = response.text || "";
    text = text.replace(/^```python/gm, '').replace(/^```/gm, '').trim();

    return text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate Fusion 360 script.");
  }
};