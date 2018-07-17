<template>
    <li>
        <a class="dropdown-item" :class="{'is-extensible':isExtensible,'is-active':isActive,'is-current':isCurrent}"
           href="javascript:void(0)" @mouseover="isCurrent=true" @mouseout="isCurrent=false"
           @click.stop="handleMenuItemClicked">
            <slot></slot>
        </a>
    </li>
</template>

<script>

    import Emitter from 'element-ui/src/mixins/emitter'

    export default {
        componentName: 'DropdownItem',
        mixins: [Emitter],
        props: {
            isExtensible: {
                type: Boolean,
                default: false
            },
            isActive: {
                type: Boolean,
                default: false
            },
            clickHandler: {
                type: Function,
                default: evt => {
                }
            }
        },
        data() {
            return {
                isCurrent: false
            }
        },
        methods: {
            handleMenuItemClicked(evt) {
                if (!this.isExtensible) {
                    this.clickHandler(evt)
                    this.dispatch('Dropdown', 'menu-item-click')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dropdown-item {
        position: relative;
        display: block;
        line-height: 27px;
        padding: 0 15px;
        text-decoration: none;
        white-space: nowrap;
        cursor: pointer;
        font-size: 12px;
        color: #5a5e66;
        &:hover {
            background-color: #ebf7e6;
            color: #5ebc33;
        }
        &.is-active {
            color: #5ebc33;
        }
        &.is-extensible:after {
            font-family: element-icons;
            content: "\E604";
            color: #bfcbd9;
            font-size: 12px;
            position: absolute;
            right: 10px;
        }
        & > .dropdown-menu {
            top: 0;
            left: 100%;
        }
        &.is-current {
            & > .dropdown-menu {
                display: block;
            }
        }
    }

    li {
        list-style: none
    }
</style>
