<template>
  <ul class="dropdown-menu">
    <slot></slot>
  </ul>
</template>

<script>

export default {
	componentName: 'DropdownMenu'
}
</script>

<style lang="scss" scoped>
.dropdown-menu {
	display: none;
	z-index: 20000;
	min-width: 100%;
	position: absolute;
	top: 100%;
	left: 0;
	padding: 5px 0;
	background-color: #fff;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
