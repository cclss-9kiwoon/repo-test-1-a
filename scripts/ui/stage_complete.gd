extends CanvasLayer
## Stage completion screen showing recipe and coin tally.

signal next_stage_requested

@onready var recipe_label: Label = $PanelContainer/VBoxContainer/RecipeLabel
@onready var coin_label: Label = $PanelContainer/VBoxContainer/CoinLabel
@onready var next_button: Button = $PanelContainer/VBoxContainer/NextButton


func _ready() -> void:
	visible = false
	process_mode = Node.PROCESS_MODE_ALWAYS
	if next_button:
		next_button.pressed.connect(_on_next_pressed)


func show_completion(stage_number: int, coins_earned: int) -> void:
	visible = true
	get_tree().paused = true

	var recipe = GameManager.stage_recipes.get(stage_number, {})
	if recipe_label:
		recipe_label.text = recipe.get("display_name", recipe.get("name", ""))

	if coin_label:
		coin_label.text = "Coins: %d" % coins_earned

	GameManager.complete_stage(stage_number)
	GameManager.save_game()


func _on_next_pressed() -> void:
	get_tree().paused = false
	visible = false
	var next_stage = GameManager.current_stage + 1
	if next_stage <= 3:  # MVP has 3 stages
		SceneManager.go_to_stage(next_stage)
	else:
		# Final stage — go to party ending
		SceneManager.change_scene("res://scenes/stages/party_ending.tscn")
	next_stage_requested.emit()
