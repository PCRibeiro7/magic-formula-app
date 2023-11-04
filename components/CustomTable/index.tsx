import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

import Paper from "@mui/material/Paper";

import { visuallyHidden } from "@mui/utils";
import { Tooltip } from "@mui/material";
import { checkIfTickerIsBestRanked } from "@/utils/wallets";
import { Checkbox } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { nFormatter } from "@/utils/math";
import { Stock } from "@/types/stock";
import { ChangeEvent, SetStateAction, useState } from "react";

function descendingComparator(
    a: { [x: string]: any },
    b: { [x: string]: any },
    orderBy: string | number
) {
    if ((b[orderBy] || 0) < (a[orderBy] || 0)) {
        return -1;
    }
    if ((b[orderBy] || 0) > (a[orderBy] || 0)) {
        return 1;
    }
    return 0;
}

function getComparator(order: string, orderBy: any) {
    return order === "desc"
        ? (a: any, b: any) => descendingComparator(a, b, orderBy)
        : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(
    array: any[],
    comparator: { (a: any, b: any): number; (arg0: any, arg1: any): any }
) {
    const stabilizedThis = array.map((el: any, index: any) => [el, index]);
    stabilizedThis.sort((a: number[], b: number[]) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el: any[]) => el[0]);
}

interface EnhancedTableHeadProps {
    numSelected: number;
    onRequestSort: (event: any, property: any) => void;
    onSelectAllClick: (event: any) => void;
    order: "asc" | "desc";
    orderBy: string;
    rowCount: number;
    headCells: any[];
}
function EnhancedTableHead({
    order,
    orderBy,
    onRequestSort,
    headCells,
}: EnhancedTableHeadProps) {
    const createSortHandler = (property: any) => (event: any) => {
        onRequestSort(event, property);
    };
    const headCellWithRank = [
        { id: "number_rank_default", label: "Rank" },
        ...headCells,
    ];

    return (
        <TableHead>
            <TableRow>
                {headCellWithRank.map((headCell) => (
                    <Tooltip title={headCell.tooltip} key={headCell.id}>
                        <TableCell
                            align={headCell.numeric ? "right" : "left"}
                            padding={
                                headCell.disablePadding ? "none" : "normal"
                            }
                            sortDirection={
                                orderBy === headCell.id ? order : false
                            }
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={
                                    orderBy === headCell.id ? order : "asc"
                                }
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === "desc"
                                            ? "sorted descending"
                                            : "sorted ascending"}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    </Tooltip>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

interface CustomTableProps {
    rows: any[];
    headCells: any[];
    initialOrderBy: { column: string; direction: "asc" | "desc" };
    favoriteTickers: any[];
    updateFavoriteTickers: (ticker: any, action: "add" | "remove") => void;
    dense?: boolean;
}

export default function CustomTable({
    rows,
    headCells,
    initialOrderBy,
    favoriteTickers,
    updateFavoriteTickers,
    dense = false,
}: CustomTableProps) {
    const [order, setOrder] = useState<"asc" | "desc">(
        initialOrderBy.direction
    );
    const [orderBy, setOrderBy] = useState(initialOrderBy.column);
    const [selected, setSelected] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const handleRequestSort = (_event: any, property: any) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
        setPage(0);
    };

    const handleSelectAllClick = (event: { target: { checked: any } }) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n: { name: any }) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (_event: any, newPage: SetStateAction<number>) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClickOnStar = (
        event: ChangeEvent<HTMLInputElement>,
        ticker: any
    ) => {
        const action = event.target.checked ? "add" : "remove";
        updateFavoriteTickers(ticker, action);
    };

    const isSelected = (name: any) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                    <Table
                        aria-labelledby="tableTitle"
                        size={dense ? "small" : "medium"}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            headCells={headCells}
                        />
                        <TableBody>
                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map(
                                    (
                                        row: {
                                            name: any;
                                            ticker: string;
                                        } & {
                                            [x: string]: number;
                                        },
                                        index: number,
                                        stocks: Stock[]
                                    ) => {
                                        const isItemSelected = isSelected(
                                            row.name
                                        );
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        const isTickerBestRanked =
                                            checkIfTickerIsBestRanked(
                                                row.ticker,
                                                stocks
                                            );

                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.ticker}
                                                selected={isItemSelected}
                                            >
                                                <TableCell>
                                                    {index +
                                                        page * rowsPerPage +
                                                        1}
                                                    º
                                                </TableCell>
                                                {headCells.map(
                                                    (
                                                        headCell: {
                                                            id: string;
                                                            isOrdinal: any;
                                                        },
                                                        index: number
                                                    ) =>
                                                        index === 0 ? (
                                                            <TableCell
                                                                id={labelId}
                                                                scope="row"
                                                                sx={{
                                                                    color: isTickerBestRanked
                                                                        ? "gold"
                                                                        : "",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                }}
                                                                key={
                                                                    headCell.id
                                                                }
                                                            >
                                                                <a
                                                                    target="_blank"
                                                                    href={`https://statusinvest.com.br/acoes/${row.ticker}`}
                                                                    rel="noreferrer"
                                                                >
                                                                    {row.ticker}
                                                                </a>
                                                                <Checkbox
                                                                    checked={favoriteTickers.includes(
                                                                        row.ticker
                                                                    )}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleClickOnStar(
                                                                            e,
                                                                            row.ticker
                                                                        )
                                                                    }
                                                                    value={
                                                                        row.ticker
                                                                    }
                                                                    icon={
                                                                        <StarOutlineIcon />
                                                                    }
                                                                    checkedIcon={
                                                                        <StarIcon />
                                                                    }
                                                                    sx={{
                                                                        "&.Mui-checked":
                                                                            {
                                                                                color: "gold",
                                                                            },
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        ) : (
                                                            <TableCell
                                                                align="right"
                                                                key={
                                                                    row.ticker +
                                                                    headCell.id
                                                                }
                                                            >
                                                                {isNaN(
                                                                    row[
                                                                        headCell
                                                                            .id
                                                                    ]
                                                                ) ||
                                                                headCell.isOrdinal
                                                                    ? row[
                                                                          headCell
                                                                              .id
                                                                      ]
                                                                    : nFormatter(
                                                                          row[
                                                                              headCell
                                                                                  .id
                                                                          ],
                                                                          2
                                                                      )}
                                                                {headCell.isOrdinal &&
                                                                    "º"}
                                                            </TableCell>
                                                        )
                                                )}
                                            </TableRow>
                                        );
                                    }
                                )}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, rows.length]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Linhas por página:"
                />
            </Paper>
        </Box>
    );
}
