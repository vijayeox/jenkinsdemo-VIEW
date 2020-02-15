import React, { useEffect, useState, useRef } from 'react'
import OX_Grid from '../../OX_Grid'

function QueryResult(props) {
    const [columnNames, setColumnNames] = useState();
    const [gridData, setGridData] = useState([]);
    const refreshGrid = useRef(null)

    useEffect(() => {
        setGridData(props.queryResult)
        setColumnNames(props.columns)
    }, [props.queryResult])

    return (
        <div className="query-result-tab" id="query-result-tab">
            <OX_Grid
                ref={refreshGrid}
                osjsCore={props.core}
                data={gridData || ""}
                filterable={true}
                reorderable={true}
                sortable={true}
                pageable={true}
                columnConfig={columnNames || [{}]}
            />
        </div>
    )
}
export default QueryResult;
