import React, { useEffect, useState, useCallback } from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { TableFooter } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { NotificationManager } from 'react-notifications';
import DonutChart from 'react-donut-chart';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'statecode', numeric: false, disablePadding: true, label: 'State Code' },
    { id: 'state', numeric: false, disablePadding: true, label: 'State' },
    { id: 'confirmed', numeric: false, disablePadding: true, label: 'Confirmed' },
    { id: 'recovered', numeric: false, disablePadding: true, label: 'Recovered' },
    { id: 'deaths', numeric: false, disablePadding: true, label: 'Deceased' },
    { id: 'lastupdatedtime', numeric: false, disablePadding: true, label: 'Date time' }


];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="right"
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired
};

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <Tooltip title="First Page">
                <span>
                    <IconButton
                        onClick={handleFirstPageButtonClick}
                        disabled={page === 0}
                        aria-label="first page"
                    >
                        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Previous">
                <span>
                    <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Next">
                <span>
                    <IconButton
                        onClick={handleNextButtonClick}
                        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                        aria-label="next page"
                    >
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Last Page">
                <span>
                    <IconButton
                        onClick={handleLastPageButtonClick}
                        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                        aria-label="last page"
                    >
                        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                    </IconButton>
                </span>
            </Tooltip>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};



export function ShowCovidData(props) {

    const [covidDataList, setCovidDataList] = useState([]);   

    let apiUrl = 'https://data.covid19india.org/data.json';

    const classes = useStyles();

    let totalCases = [];

    let totalConfirmed = 0;
    let totalRecovered = 0;
    let totaldeaths = 0;

    const [page, setPage] = React.useState(0);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('state');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleGetStatesCovidData = useCallback(() => {

        fetch(apiUrl)
            .then(response => response.json())
            .then(result => {
                setCovidDataList(result.statewise);
               
            }).catch(function (err) {
                NotificationManager.error('Failed to fetch Error occured Contact Admin!', 'Error', 3000);

       });

    }, [apiUrl])

    useEffect(() => {
        handleGetStatesCovidData();       
        
       
    }, [handleGetStatesCovidData]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };   

    totalCases = covidDataList.filter(c => c.state === 'Total');
    if (totalCases.length > 0) {
        totalConfirmed = Number(totalCases[0].confirmed);
        totalRecovered = Number(totalCases[0].recovered);
        totaldeaths = Number(totalCases[0].deaths);
    }
    
   // console.log('total cases: ', totalCases);

    return (
        <div>
            <h3>Covid data State Wise </h3>
            <br />
            <Paper className={classes.paper}>
            <TableContainer>
                <Table className={classes.table}
                    aria-labelledby="tableTitle"
                    aria-label="enhanced table" >

                    <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={covidDataList.length}
                    />
                    <TableBody>
                        {stableSort(covidDataList, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((list, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell align="right"> {list.statecode} </TableCell>
                                        <TableCell align="right"> {list.state} </TableCell>
                                        <TableCell align="right">{list.confirmed}</TableCell>
                                        <TableCell align="right">{list.recovered}</TableCell>
                                        <TableCell align="right">{list.deaths}</TableCell>
                                        <TableCell align="right">{list.lastupdatedtime}</TableCell>

                                    </TableRow>
                                );
                            })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 15]}
                                count={covidDataList.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
                </TableContainer>
            </Paper>
            <br /> 
            <hr />
            <br />
            <h3> Total Number of Covid Cases </h3>
            <br />
            <DonutChart
                data={
                    [

                        {
                            label: 'Total Confirmed',
                            value: totalConfirmed
                        },
                        {
                            label: 'Total Recovered',
                            value: totalRecovered
                        },
                        {
                            label: 'Total Deceased',
                            value: totaldeaths
                        }
                    ]

                } />

        </div>
    );



}