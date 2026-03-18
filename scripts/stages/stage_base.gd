class_name StageBase
extends Node2D
## Base class for all playable stages.
## Handles companion meeting points, stage completion, and camera bounds.

@export var stage_number: int = 1

@onready var player: PlayerController = $Player
@onready var companion_chain: CompanionChain = $Player/CompanionChain
@onready var hud: CanvasLayer = $HUD
@onready var dialogue_box = $DialogueBox
@onready var stage_complete_screen = $StageCompleteScreen
@onready var camera: Camera2D = $Player/Camera2D

var coins_at_start: int = 0
var active_companions_in_stage: Array[CompanionController] = []

# Companion data for dialogue
var companion_dialogues: Dictionary = {
	"rosie": {
		"display_name": "Rosie",
		"lines": ["Welcome, welcome! You must be the steamboat pilot!", "The village is preparing a Grand Feast -- and we need help!", "Come along, I know just where to start!"]
	},
	"barnaby": {
		"display_name": "Barnaby",
		"lines": ["Well now... that sure is a fine lookin' steamboat.", "You say there's gonna be a feast? ...With cookin'?", "I reckon I better come along and make sure you do it right!"]
	},
	"pepper": {
		"display_name": "Pepper",
		"lines": ["Psst! Hey, hey, you! Up here!", "I know where the BEST apples are -- follow me!", "Just... don't tell anyone about that thing I knocked over."]
	}
}


func _ready() -> void:
	coins_at_start = GameManager.coins
	GameManager.start_stage(stage_number)
	GameManager.recipe_completed.connect(_on_recipe_completed)

	# Add previously unlocked companions to the chain
	_restore_existing_companions()


func _restore_existing_companions() -> void:
	# Add companions unlocked in previous stages (except william, who is the player)
	for companion_name in GameManager.companions_unlocked:
		if companion_name == "william":
			continue
		# Check if this companion should already be in the chain
		# (unlocked in a previous stage, not this stage)
		var stage_companions = GameManager.stage_companions.get(stage_number, [])
		if companion_name not in stage_companions:
			_spawn_companion(companion_name)


func _spawn_companion(character_name: String) -> CompanionController:
	var companion_scene = load("res://scenes/characters/%s.tscn" % character_name)
	if not companion_scene:
		push_warning("Could not load companion scene: %s" % character_name)
		return null

	var companion = companion_scene.instantiate() as CompanionController
	if not companion:
		return null

	companion.character_name = character_name
	add_child(companion)
	companion_chain.add_companion(companion)
	active_companions_in_stage.append(companion)
	return companion


func trigger_companion_meeting(character_name: String) -> void:
	if character_name in GameManager.companions_unlocked:
		return  # Already unlocked

	# Show dialogue
	var dialogue_data = companion_dialogues.get(character_name, {})
	var display_name = dialogue_data.get("display_name", character_name)
	var lines: Array[String] = []
	for line in dialogue_data.get("lines", []):
		lines.append(line)

	if dialogue_box and lines.size() > 0:
		dialogue_box.start_dialogue(display_name, lines)
		await dialogue_box.dialogue_finished

	# Unlock and spawn
	GameManager.unlock_companion(character_name)
	_spawn_companion(character_name)


func _on_recipe_completed(_recipe_name: String) -> void:
	# Stage complete
	var coins_earned = GameManager.coins - coins_at_start
	if stage_complete_screen:
		stage_complete_screen.show_completion(stage_number, coins_earned)
