export const config = {
    column_info_conf: [         //字段信息table
        {
            prop_conf: 'alias',
            label_conf: '字段名称'
        }, {
            prop_conf: 'type',
            label_conf: '字段类型'
        }, {
            prop_conf: 'memo',
            label_conf: '字段备注'
        }
    ], dict_info_conf: [           //字典信息table
        {
            prop_conf: 'key',
            label_conf: '数据名称'
        }, {
            prop_conf: 'value',
            label_conf: '数据标识'
        }, {
            prop_conf: 'seq',
            label_conf: '数据排序'
        }
    ],
    scene_list_conf: [   //场景列表table
        {
            prop_conf: 'id',
            label_conf: 'ID'
        },
        {
            prop_conf: 'name',
            label_conf: '分析场景名称'
        },
        {
            prop_conf: 'memo',
            label_conf: '备注'
        },
        {
            prop_conf: 'status',
            label_conf: '状态'
        },
        {
            prop_conf: 'last_publish_time',
            label_conf: '上一次发布时间'
        },
        {
            prop_conf: 'operator',
            label_conf: '操作'
        }
    ],
    data_table_conf:[
        {
            prop_conf: 'col_name',
            label_conf: '字段标识'
        },
        {
            prop_conf: 'type',
            label_conf: '字段类型'
        },
    ],
    scene_column_conf:[
        {
            prop_conf: 'col_name',
            label_conf: '字段标识'
        },
        {
            prop_conf: 'alias',
            label_conf: '字段名称'
        },
        {
            prop_conf: 'type',
            label_conf: '字段类型'
        },
        {
            prop_conf: 'memo',
            label_conf: '字段备注'
        },
        {
            prop_conf: 'attribute',
            label_conf: '字段属性'
        },
        {
            prop_conf: 'operator',
            label_conf: '操作'
        },
        {
            prop_conf: 'is_calendar',
            label_conf: '选择日期字段'
        },
        {
            prop_conf: 'is_show',
            label_conf: '是否展示给用户'
        }
    ],
    scene_column_preview_conf:[
        {
            prop_conf: 'alias',
            label_conf: '字段名称'
        },
        {
            prop_conf: 'col_name',
            label_conf: '字段标识'
        },
        {
            prop_conf: 'type',
            label_conf: '字段类型'
        },
        {
            prop_conf: 'attribute',
            label_conf: '字段属性'
        },
        {
            prop_conf: 'memo',
            label_conf: '字段备注'
        }
    ]
}