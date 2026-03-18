shader_type canvas_item;

// 1930s film grain post-processing effect
// Apply to a ColorRect on a CanvasLayer above all game content

uniform float grain_intensity : hint_range(0.0, 0.15) = 0.04;
uniform float vignette_intensity : hint_range(0.0, 1.0) = 0.3;
uniform float scratch_intensity : hint_range(0.0, 0.05) = 0.01;
uniform float scratch_frequency : hint_range(0.0, 1.0) = 0.15;
uniform float sepia_strength : hint_range(0.0, 0.5) = 0.1;

// Pseudo-random hash
float hash(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * 0.1031);
	p3 += dot(p3, p3.yzx + 33.33);
	return fract((p3.x + p3.y) * p3.z);
}

// Film grain noise
float grain(vec2 uv, float t) {
	return hash(uv * 500.0 + vec2(t * 17.0, t * 13.0)) - 0.5;
}

// Vertical film scratch
float scratch(vec2 uv, float t) {
	float line_x = hash(vec2(floor(t * 3.0), 0.0));
	float dist = abs(uv.x - line_x);
	float visible = step(1.0 - scratch_frequency, hash(vec2(floor(t * 2.0), 1.0)));
	return visible * smoothstep(0.002, 0.0, dist);
}

void fragment() {
	vec4 col = texture(TEXTURE, UV);

	// Film grain
	float t = TIME;
	float noise = grain(UV, t) * grain_intensity;
	col.rgb += vec3(noise);

	// Vignette
	vec2 center_dist = UV - vec2(0.5);
	float vignette = 1.0 - dot(center_dist, center_dist) * vignette_intensity * 2.0;
	vignette = clamp(vignette, 0.0, 1.0);
	col.rgb *= vignette;

	// Film scratches
	float s = scratch(UV, t) * scratch_intensity;
	col.rgb += vec3(s);

	// Subtle sepia tint
	float gray = dot(col.rgb, vec3(0.299, 0.587, 0.114));
	vec3 sepia = vec3(gray * 1.05, gray * 0.93, gray * 0.82);
	col.rgb = mix(col.rgb, sepia, sepia_strength);

	COLOR = col;
}
