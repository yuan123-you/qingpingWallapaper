<template>
  <view class="rating-star">
    <view 
      v-for="index in 5" 
      :key="index"
      class="rating-star__item"
      @click="handleClick(index)"
    >
      <text 
        :class="[
          'rating-star__icon',
          index <= displayScore ? 'active' : '',
          index === Math.ceil(displayScore) && displayScore % 1 !== 0 ? 'half' : ''
        ]"
      >
        {{ getStarIcon(index) }}
      </text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    default: 0
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change'])

const displayScore = computed(() => {
  return Math.max(0, Math.min(5, props.score))
})

function handleClick(index) {
  if (props.readonly) return
  emit('change', index)
}

function getStarIcon(index) {
  const score = displayScore.value
  if (index <= score) {
    return '★'
  } else if (index - 0.5 <= score) {
    return '½'
  } else {
    return '☆'
  }
}
</script>

<style lang="scss" scoped>
.rating-star {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.rating-star__item {
  cursor: pointer;
  transition: transform 0.2s;
}

.rating-star__item:active {
  transform: scale(1.2);
}

.rating-star__icon {
  font-size: 48rpx;
  color: #E0E0E0;
  transition: color 0.3s;
}

.rating-star__icon.active {
  color: #FFB800;
}

.rating-star__icon.half {
  color: #FFB800;
}
</style>
