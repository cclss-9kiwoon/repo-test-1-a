extends Area2D
## Stage exit trigger. Only activates when recipe is complete.

@export var next_stage_number: int = 2


func _ready() -> void:
	body_entered.connect(_on_body_entered)


func _on_body_entered(body: Node2D) -> void:
	if body is PlayerController and GameManager.is_recipe_complete():
		var coins_earned = GameManager.coins
		var stage = get_parent()
		while stage and not (stage is StageBase):
			stage = stage.get_parent()
		if stage and stage.stage_complete_screen:
			stage.stage_complete_screen.show_completion(GameManager.current_stage, coins_earned)
