extends CanvasLayer
## Character introduction dialogue system with typewriter effect.

signal dialogue_finished

@onready var panel: PanelContainer = $PanelContainer
@onready var name_label: Label = $PanelContainer/VBoxContainer/NameLabel
@onready var text_label: Label = $PanelContainer/VBoxContainer/TextLabel

var dialogue_lines: Array[String] = []
var current_line_index: int = 0
var is_typing: bool = false
var current_text: String = ""
var char_index: int = 0
var type_speed: float = 0.03  # seconds per character
var type_timer: float = 0.0
var auto_advance_time: float = 3.0
var auto_timer: float = 0.0
var is_active: bool = false


func _ready() -> void:
	visible = false
	process_mode = Node.PROCESS_MODE_ALWAYS


func _process(delta: float) -> void:
	if not is_active:
		return

	if is_typing:
		type_timer += delta
		if type_timer >= type_speed:
			type_timer = 0.0
			char_index += 1
			if char_index >= current_text.length():
				is_typing = false
				auto_timer = 0.0
			if text_label:
				text_label.text = current_text.substr(0, char_index + 1)
	else:
		# Auto-advance after timeout
		auto_timer += delta
		if auto_timer >= auto_advance_time:
			advance()


func _input(event: InputEvent) -> void:
	if not is_active:
		return
	if event is InputEventMouseButton and event.pressed:
		if is_typing:
			# Skip to full text
			is_typing = false
			char_index = current_text.length()
			if text_label:
				text_label.text = current_text
		else:
			advance()
	elif event is InputEventKey and event.pressed:
		if is_typing:
			is_typing = false
			char_index = current_text.length()
			if text_label:
				text_label.text = current_text
		else:
			advance()


func start_dialogue(character_display_name: String, lines: Array[String]) -> void:
	dialogue_lines = lines
	current_line_index = 0
	is_active = true
	visible = true
	get_tree().paused = true

	if name_label:
		name_label.text = character_display_name

	_show_line(0)


func _show_line(index: int) -> void:
	if index >= dialogue_lines.size():
		end_dialogue()
		return

	current_text = dialogue_lines[index]
	char_index = 0
	is_typing = true
	type_timer = 0.0
	auto_timer = 0.0
	if text_label:
		text_label.text = ""


func advance() -> void:
	current_line_index += 1
	if current_line_index >= dialogue_lines.size():
		end_dialogue()
	else:
		_show_line(current_line_index)


func end_dialogue() -> void:
	is_active = false
	visible = false
	get_tree().paused = false
	dialogue_finished.emit()
