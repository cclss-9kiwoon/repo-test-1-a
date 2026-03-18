extends Node
## Handles scene transitions with fade effects.

signal transition_started
signal transition_finished

var _transition_layer: CanvasLayer
var _color_rect: ColorRect
var _is_transitioning: bool = false


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS

	_transition_layer = CanvasLayer.new()
	_transition_layer.layer = 100
	add_child(_transition_layer)

	_color_rect = ColorRect.new()
	_color_rect.color = Color.BLACK
	_color_rect.set_anchors_preset(Control.PRESET_FULL_RECT)
	_color_rect.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_color_rect.modulate.a = 0.0
	_transition_layer.add_child(_color_rect)


func change_scene(scene_path: String, fade_duration: float = 0.3) -> void:
	if _is_transitioning:
		return
	_is_transitioning = true
	transition_started.emit()

	# Fade out
	var tween = create_tween()
	tween.tween_property(_color_rect, "modulate:a", 1.0, fade_duration)
	await tween.finished

	# Change scene
	get_tree().change_scene_to_file(scene_path)

	# Fade in
	tween = create_tween()
	tween.tween_property(_color_rect, "modulate:a", 0.0, fade_duration)
	await tween.finished

	_is_transitioning = false
	transition_finished.emit()


func go_to_stage(stage_number: int) -> void:
	GameManager.start_stage(stage_number)
	var path = "res://scenes/stages/stage_%d.tscn" % stage_number
	change_scene(path)


func go_to_main_menu() -> void:
	change_scene("res://scenes/ui/main_menu.tscn")
