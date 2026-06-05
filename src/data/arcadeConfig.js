export const ARCADE_INITIAL_COINS = 1000
export const ARCADE_INITIAL_ACTIONS = 20

export const ARCADE_REWARD_CALC = 150
export const ARCADE_REWARD_COMPARISON = 200
export const ARCADE_REWARD_DEFAULT = 150

export function getArcadeReward(question) {
	if (typeof question?.rewardOverride === 'number') return question.rewardOverride
	if (question?.type === 'comparison') return ARCADE_REWARD_COMPARISON
	if (question?.type === 'calc') return ARCADE_REWARD_CALC
	return ARCADE_REWARD_DEFAULT
}
