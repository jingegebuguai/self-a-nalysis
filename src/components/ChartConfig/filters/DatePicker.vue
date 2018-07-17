<template>
    <v-date-picker
            :mode='mode'
            tint-color='#ff6666'
            v-model='dates'
            :is-inline='isInline'
            :theme-styles='themeStyles'
            @drag="drag"
            is-double-paned>
    </v-date-picker>
</template>

<script>
    import moment from 'moment'

    export default {
        props: {
            mode: {type: String, default: 'range'},
            isInline: {Boolean, default: true},
            selectedValue: {
                type: null,
                default: new Object({'startDate': moment(new Date()).format("YYYY-MM-DD"),'endDate': moment(new Date()).format("YYYY-MM-DD")})
            }
        },
        data() {
            return {
                dates: {start: new Date(), end: new Date()},
                themeStyles: {
                    wrapper: {
                        border: '0', // Override the default border
                    },
                    header: {
                        color: '#fafafa',
                        backgroundColor: '#4a5867',
                        borderColor: '#404c59',
                        borderWidth: '1px 1px 0 1px',
                    },
                    headerVerticalDivider: {
                        borderLeft: '1px solid #404c59',
                    },
                    weekdays: {
                        color: '#98aeb3',
                        backgroundColor: '#4a5867',
                        borderColor: '#384763',
                        borderWidth: '0 1px',
                        paddingTop: '5px',
                        paddingBottom: '10px',
                    },
                    weekdaysVerticalDivider: {
                        borderLeft: '1px solid #404c59',
                    },
                    weeks: {
                        border: '1px solid #dadada',
                    },
                }
            };
        },
        methods: {
            drag(obj) {
                if (obj != null)
                    this.$emit('getDate', {
                        startDate: moment(obj.start).format("YYYY-MM-DD"),
                        endDate: moment(obj.end).format("YYYY-MM-DD")
                    })
            }
        },
        mounted() {
            if (this.selectedValue) {
                this.dates.start = moment(this.selectedValue.startDate).toDate()
                this.dates.end = moment(this.selectedValue.endDate).toDate()
            }
        }
    };
</script>

<style>
    .picker {
        min-width: 220px
    }
</style>
