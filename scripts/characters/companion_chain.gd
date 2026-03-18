class_name CompanionChain
extends Node
## Manages the chain of companions following the player.
## Uses a Position History Queue: records player position every frame,
## each companion reads from the queue at a fixed offset (delay).

@export var companion_spacing: int = 20  # frames between each companion
@export var max_history_size: int = 600  # 10 seconds at 60fps

var player: PlayerController
var companions: Array[CompanionController] = []
var position_history: Array[Dictionary] = []


func _ready() -> void:
	player = get_parent() as PlayerController
	if not player:
		push_error("CompanionChain must be a child of PlayerController")


func _physics_process(_delta: float) -> void:
	if not player:
		return

	# Record player position and state every frame
	var record = player.get_state_record()
	position_history.push_front(record)
	if position_history.size() > max_history_size:
		position_history.pop_back()

	# Update each companion from history
	for i in range(companions.size()):
		var history_index = (i + 1) * companion_spacing
		if history_index < position_history.size():
			var target = position_history[history_index]
			companions[i].apply_history_record(target)


func add_companion(companion: CompanionController) -> void:
	companions.append(companion)
	# Place companion at player's current position initially
	companion.global_position = player.global_position


func remove_companion(companion: CompanionController) -> void:
	companions.erase(companion)


func get_companion_count() -> int:
	return companions.size()
