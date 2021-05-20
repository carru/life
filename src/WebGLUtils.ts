export class WebGLUtils {
    /**
     * Creates and compiles a shader from GLSL.
     *
     * @param {!WebGLRenderingContext} gl WebGL Context.
     * @param {string} shaderSource GLSL source code for the shader.
     * @param {number} shaderType Type of shader, VERTEX_SHADER or FRAGMENT_SHADER.
     * @return {!WebGLShader} Shader.
     */
    public static compileShader(gl: WebGLRenderingContext, shaderSource: string, shaderType: number) {
        // Create shader object
        const shader = gl.createShader(shaderType);

        // Set shader source code and compile
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        // Check if it compiled
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) throw "could not compile shader:" + gl.getShaderInfoLog(shader);

        return shader;
    }

    /**
     * Creates a program from GLSL.
     *
     * @param {!WebGLRenderingContext} gl WebGL context.
     * @param {!WebGLShader} vertexShaderSource Vertex shader GLSL source code.
     * @param {!WebGLShader} fragmentShaderSource Fragment shader GLSL source code.
     * @return {!WebGLProgram} Program.
     */
    public static createProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
        // Compile shaders
        const vertexShader = WebGLUtils.compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = WebGLUtils.compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

        // Create a program
        const program = gl.createProgram();

        // Attach shaders
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        // Link program
        gl.linkProgram(program);

        // Check if it linked
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) throw ("program filed to link:" + gl.getProgramInfoLog(program));

        return program;
    }
}