<template>
	<li>
		<a class="dropdown-divider"></a>
	</li>
</template>

<script>

export default {
	componentName: 'DropdownDivider'
}
</script>

<style lang="scss" scoped>
.dropdown-divider {
	display: block;
	border-top: 1px solid rgba(0, 0, 0, 0.06);
	margin: 5px 10px;
	height: 0
}
li {
	list-style: none
}
</style>
