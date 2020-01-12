import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
    { id: 'user', label: 'User', minWidth: 100 },
    {
        id: 'sub_task1',
        label: 'Score sub-task 1',
        minWidth: 60,
        align: 'right',
        format: value => value.toLocaleString(),
    },
    {
        id: 'sub_task2',
        label: 'Score sub-task 2',
        minWidth: 60,
        align: 'right',
        format: value => value.toLocaleString(),
    },
    {
        id: 'sub_task3',
        label: 'Score sub-task 3',
        minWidth: 60,
        align: 'right',
        format: value => value.toLocaleString(),
    },
    {
        id: 'task_score',
        label: 'Task average score',
        minWidth: 60,
        align: 'right',
        format: value => value.toLocaleString(),
    }
];

function createData(user, sub_task1, sub_task2, sub_task3) {
    const task_score = (sub_task1 + sub_task2 + sub_task3) / 3;
    return { name, code, population, size, task_score };
}

const rows = [
    createData('Jean', 7, 8.5, 5.6),
    createData('Paul', 7, 8.5, 5.6),
    createData('Pena', 7, 8.5, 5.6),
    createData('Pierre', 7, 8.5, 5.6),
    createData('Jacques', 7, 8.5, 5.6),
    createData('Thomas', 7, 8.5, 5.6),
    createData('Rémi', 7, 8.5, 5.6),
    createData('Alexandre', 7, 8.5, 5.6),
    createData('Jeanne', 7, 8.5, 5.6),
    createData('Estelle', 7, 8.5, 5.6),
    createData('Solène', 7, 8.5, 5.6),
    createData('Louise', 7, 8.5, 5.6),
    createData('Marie', 7, 8.5, 5.6),
    createData('Robert', 7, 8.5, 5.6),
    createData('Lola', 7, 8.5, 5.6),
];

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

function DashboardTable(props) {

    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map(column => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
    );

}

export default DashboardTable
