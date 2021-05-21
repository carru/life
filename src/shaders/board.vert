#version 300 es
        
in vec2 a_position;
in float a_mask;

out vec4 v_color;

void main() {
    // Input is 0 to 1; convert to -1 to 1 (clipspace)
    vec2 clipSpace = a_position * 2.0;
    clipSpace = clipSpace - 1.0;

    // Flip y axis so (0,0) is top-left
    clipSpace = clipSpace * vec2(1, -1);

    gl_Position = vec4(clipSpace, 0, 1);

    v_color = vec4(1, 1, 1, 1) * a_mask;
}