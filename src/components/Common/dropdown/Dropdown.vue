<template>
  <div class="dropdown" :class="{'is-active':isActive}">
    <a href="javascript:void(0)" @mouseenter="isActive=true" @mouseleave="isActive=false">
      <slot name="dropdown-toggle"></slot>
      <slot></slot>
    </a>
  </div>
</template>

<script>

import Emitter from 'element-ui/src/mixins/emitter';

export default {
	componentName: 'Dropdown',
	mixins: [Emitter],
	data() {
		return {
			isActive: false
		}
	},
	methods: {
		hideDropdownMenu() {
			this.isActive = false
		}
	},
	mounted() {
		this.$on('menu-item-click', this.hideDropdownMenu)
	}
}
</script>

<style lang="scss" scoped>
.dropdown {
	display: inline-block;
	&.is-active {
		.dropdown-menu {
			display: block;
		}
	}
}
</style>
