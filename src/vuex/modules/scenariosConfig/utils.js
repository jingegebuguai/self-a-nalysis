const removeCol = function (refer, data, row) {
    if (refer == 'new') {   //清除dataSource
        let columns = data.columns
        return columns.filter(o => o != row)
    } else {              //清除sceneData
        let columns = data.column_infos
        return columns.filter(o => o != row)
    }
}

export {
    removeCol
}