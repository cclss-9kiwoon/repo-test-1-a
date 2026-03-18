extends CanvasLayer
## Pause menu overlay.

@onready var resume_button: Button = $PanelContainer/VBoxContainer/ResumeButton
@onready var restart_button: Button = $PanelContainer/VBoxContainer/RestartButton
@onready var menu_button: Button = $PanelContainer/VBoxContainer/MenuButton

var is_paused: bool = false


func _ready() -> void:
	visible = false
	if resume_button:
		resume_button.pressed.connect(_on_resume)
	if restart_button:
		restart_button.pressed.connect(_on_restart)
	if menu_button:
		menu_button.pressed.connect(_on_menu)


func _input(event: InputEvent) -> void:
	if event.is_action_pressed("pause"):
		toggle_pause()


func toggle_pause() -> void:
	is_paused = not is_paused
	visible = is_paused
	get_tree().paused = is_paused


func _on_resume() -> void:
	toggle_pause()


func _on_restart() -> void:
	get_tree().paused = false
	is_paused = false
	SceneManager.go_to_stage(GameManager.current_stage)


func _on_menu() -> void:
	get_tree().paused = false
	is_paused = false
	SceneManager.go_to_main_menu()
