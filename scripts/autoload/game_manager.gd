extends Node
## Global game state manager.
## Tracks coins, ingredients, companions, and save/load.

signal coins_changed(new_total: int)
signal ingredient_collected(ingredient_name: String, current: int, required: int)
signal recipe_completed(recipe_name: String)
signal companion_joined(character_name: String)

# --- Game State ---
var coins: int = 0
var current_stage: int = 1
var companions_unlocked: Array[String] = ["mickey"]
var collected_ingredients: Dictionary = {}  # {"honey": 2, "flour": 1, ...}
var recipes_completed: Array[String] = []
var stages_completed: Array[int] = []

# --- Stage Recipes ---
var stage_recipes: Dictionary = {
	1: {
		"name": "Welcome Sandwiches",
		"display_name": "환영 샌드위치",
		"ingredients": {"bread": 3, "cheese": 2, "lettuce": 1}
	},
	2: {
		"name": "Honey Cakes",
		"display_name": "꿀 케이크",
		"ingredients": {"honey_pot": 3, "flour": 2, "egg": 1}
	},
	3: {
		"name": "Acorn Stew",
		"display_name": "도토리 스튜",
		"ingredients": {"acorn": 4, "carrot": 2, "mushroom": 1, "water": 1}
	}
}

# --- Stage Companions ---
var stage_companions: Dictionary = {
	1: ["christopher_robin"],
	2: ["pooh"],
	3: ["piglet"]
}


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS


func add_coins(amount: int) -> void:
	coins += amount
	coins_changed.emit(coins)


func collect_ingredient(ingredient_name: String) -> void:
	if ingredient_name not in collected_ingredients:
		collected_ingredients[ingredient_name] = 0
	collected_ingredients[ingredient_name] += 1

	var recipe = stage_recipes.get(current_stage, {})
	var required = recipe.get("ingredients", {}).get(ingredient_name, 0)
	var current = collected_ingredients[ingredient_name]
	ingredient_collected.emit(ingredient_name, current, required)

	check_recipe_completion()


func check_recipe_completion() -> void:
	var recipe = stage_recipes.get(current_stage, {})
	var ingredients = recipe.get("ingredients", {}) as Dictionary
	for ingredient_name in ingredients:
		var required = ingredients[ingredient_name]
		var current = collected_ingredients.get(ingredient_name, 0)
		if current < required:
			return
	# Recipe complete
	var recipe_name = recipe.get("name", "")
	if recipe_name not in recipes_completed:
		recipes_completed.append(recipe_name)
		recipe_completed.emit(recipe_name)


func unlock_companion(character_name: String) -> void:
	if character_name not in companions_unlocked:
		companions_unlocked.append(character_name)
		companion_joined.emit(character_name)


func complete_stage(stage_number: int) -> void:
	if stage_number not in stages_completed:
		stages_completed.append(stage_number)


func is_recipe_complete() -> bool:
	var recipe = stage_recipes.get(current_stage, {})
	var ingredients = recipe.get("ingredients", {}) as Dictionary
	for ingredient_name in ingredients:
		var required = ingredients[ingredient_name]
		var current = collected_ingredients.get(ingredient_name, 0)
		if current < required:
			return false
	return true


func get_recipe_progress() -> Dictionary:
	var recipe = stage_recipes.get(current_stage, {})
	var ingredients = recipe.get("ingredients", {}) as Dictionary
	var progress = {}
	for ingredient_name in ingredients:
		progress[ingredient_name] = {
			"current": collected_ingredients.get(ingredient_name, 0),
			"required": ingredients[ingredient_name]
		}
	return progress


func reset_stage_collectibles() -> void:
	collected_ingredients.clear()


func start_stage(stage_number: int) -> void:
	current_stage = stage_number
	reset_stage_collectibles()


# --- Save / Load ---
func save_game() -> void:
	var save_data = {
		"coins": coins,
		"current_stage": current_stage,
		"companions_unlocked": companions_unlocked,
		"recipes_completed": recipes_completed,
		"stages_completed": stages_completed
	}
	var file = FileAccess.open("user://savegame.json", FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(save_data, "\t"))


func load_game() -> bool:
	if not FileAccess.file_exists("user://savegame.json"):
		return false
	var file = FileAccess.open("user://savegame.json", FileAccess.READ)
	if not file:
		return false
	var json = JSON.new()
	var error = json.parse(file.get_as_text())
	if error != OK:
		return false
	var data = json.data
	coins = data.get("coins", 0)
	current_stage = data.get("current_stage", 1)
	companions_unlocked = Array(data.get("companions_unlocked", ["mickey"]), TYPE_STRING, "", null)
	recipes_completed = Array(data.get("recipes_completed", []), TYPE_STRING, "", null)
	stages_completed = Array(data.get("stages_completed", []), TYPE_INT, "", null)
	return true
