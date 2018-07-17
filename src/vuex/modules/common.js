const getDimensionAndSplitdims = function (chart_type, original_dim, original_split) {
    let dimensions = [], splitdims = []
    if (chart_type === 'table') {
        dimensions = [...original_dim, ...original_split]
    } else if (chart_type === 'line_chart') {
        if (original_dim && original_dim.length > 0) {
            splitdims = original_dim.slice(1)
        }
        if (original_dim.length > 0) {
            dimensions = original_dim.slice(0, 1)
        }
    }
    return {
        dimensions,
        splitdims
    }
}

export {
    getDimensionAndSplitdims
}