<template>
  <button
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--disabled': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
import { defineEmits } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Button',
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success'].includes(value),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:focus {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.btn--small {
  padding: 6px 12px;
  font-size: 14px;
}

.btn--medium {
  padding: 10px 20px;
  font-size: 16px;
}

.btn--large {
  padding: 14px 28px;
  font-size: 18px;
}

.btn--primary {
  background-color: #007bff;
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn--secondary {
  background-color: #6c757d;
  color: white;
}

.btn--secondary:hover:not(:disabled) {
  background-color: #545b62;
}

.btn--danger {
  background-color: #dc3545;
  color: white;
}

.btn--danger:hover:not(:disabled) {
  background-color: #c82333;
}

.btn--success {
  background-color: #28a745;
  color: white;
}

.btn--success:hover:not(:disabled) {
  background-color: #218838;
}

.btn--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

