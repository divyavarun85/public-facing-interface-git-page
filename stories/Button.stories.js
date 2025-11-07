import Button from '../src/components/Button.vue'

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger', 'success'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    onClick: { action: 'clicked' },
  },
}

export const Primary = {
  args: {
    label: 'Button',
    variant: 'primary',
    size: 'medium',
    disabled: false,
  },
}

export const Secondary = {
  args: {
    label: 'Button',
    variant: 'secondary',
    size: 'medium',
    disabled: false,
  },
}

export const Danger = {
  args: {
    label: 'Delete',
    variant: 'danger',
    size: 'medium',
    disabled: false,
  },
}

export const Success = {
  args: {
    label: 'Success',
    variant: 'success',
    size: 'medium',
    disabled: false,
  },
}

export const Small = {
  args: {
    label: 'Small Button',
    variant: 'primary',
    size: 'small',
    disabled: false,
  },
}

export const Large = {
  args: {
    label: 'Large Button',
    variant: 'primary',
    size: 'large',
    disabled: false,
  },
}

export const Disabled = {
  args: {
    label: 'Disabled Button',
    variant: 'primary',
    size: 'medium',
    disabled: true,
  },
}

export const WithCustomContent = {
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">🚀 Custom Content</Button>',
  }),
}

