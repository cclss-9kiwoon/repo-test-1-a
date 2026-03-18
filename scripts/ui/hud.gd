extends CanvasLayer
## In-game HUD showing coins and recipe progress.

@onready var coin_label: Label = $CoinContainer/CoinLabel
@onready var ingredient_container: VBoxContainer = $IngredientContainer


func _ready() -> void:
	GameManager.coins_changed.connect(_on_coins_changed)
	GameManager.ingredient_collected.connect(_on_ingredient_collected)
	GameManager.recipe_completed.connect(_on_recipe_completed)
	_update_coin_display()
	_update_ingredient_display()


func _on_coins_changed(new_total: int) -> void:
	_update_coin_display()


func _on_ingredient_collected(_ingredient_name: String, _current: int, _required: int) -> void:
	_update_ingredient_display()


func _on_recipe_completed(recipe_name: String) -> void:
	_update_ingredient_display()


func _update_coin_display() -> void:
	if coin_label:
		coin_label.text = str(GameManager.coins)


func _update_ingredient_display() -> void:
	if not ingredient_container:
		return

	# Clear existing labels
	for child in ingredient_container.get_children():
		child.queue_free()

	# Show recipe progress
	var progress = GameManager.get_recipe_progress()
	for ingredient_name in progress:
		var info = progress[ingredient_name]
		var label = Label.new()
		label.text = "%s: %d/%d" % [ingredient_name, info.current, info.required]
		if info.current >= info.required:
			label.modulate = Color.GREEN
		ingredient_container.add_child(label)
