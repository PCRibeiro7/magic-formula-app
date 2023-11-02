"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wallets_module_css_1 = __importDefault(require("styles/Wallets.module.css"));
const RankingPanel_1 = __importDefault(require("components/RankingPanel"));
const material_1 = require("@mui/material");
const WalletRules_1 = require("components/WalletRules");
const react_1 = require("react");
const react_2 = require("react");
const react_3 = __importDefault(require("react"));
const headCells = [
    {
        id: "ticker",
        numeric: false,
        disablePadding: false,
        isOrdinal: false,
        label: "Ticker",
    },
    {
        id: "momentum6M",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Valorização(%)",
    },
    {
        id: "annualizedReturn",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Retorno Anualizado(%)",
    },
    {
        id: "sixMonthsBeforePrice",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Preço Passado",
    },
    {
        id: "price",
        numeric: true,
        disablePadding: false,
        isOrdinal: false,
        label: "Preço Atual",
    },
];
const availablePeriods = [...Array(23).keys()].map((i) => i + 1);
function AcquirersMultiple() {
    const [dates, setDates] = (0, react_1.useState)({});
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [selectedPeriod, setSelectedPeriod] = (0, react_1.useState)(10);
    const [filteredStocks, setFilteredStocks] = (0, react_1.useState)([]);
    const fetchData = (0, react_2.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        const res = yield fetch(`/api/top_gainers?yearsAgo=${selectedPeriod}`);
        const { stocks, dates } = yield res.json();
        headCells.find((cell) => cell.id === "sixMonthsBeforePrice").label = `Preço ${selectedPeriod} ${selectedPeriod === 1 ? "ano" : "anos"} atrás`;
        setFilteredStocks(stocks);
        setDates(dates);
        setLoading(false);
    }), [selectedPeriod]);
    (0, react_1.useEffect)(() => {
        fetchData();
    }, [fetchData]);
    return (<div className={Wallets_module_css_1.default.container}>
            <main className={Wallets_module_css_1.default.main}>
                <h1 className={Wallets_module_css_1.default.title}>Carteira Valorização Passada: </h1>
            </main>
            <material_1.Stack maxWidth={"800px"}>
                <WalletRules_1.WalletRules ruleDescription={<>
                            1 - Ranking de empresas{" "}
                            <strong>que mais valorizaram </strong>
                            nos ulimos anos selecionados{" "}
                        </>}/>
                <material_1.Box sx={{ padding: "16px", paddingTop: "0px" }}>
                    <material_1.Typography variant="h6" sx={{ padding: "8px" }}>
                        Anos Passados:
                    </material_1.Typography>
                    <material_1.FormControl fullWidth>
                        <material_1.InputLabel id="demo-simple-select-label">
                            Anos
                        </material_1.InputLabel>
                        <material_1.Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedPeriod} label="Age" onChange={(e) => setSelectedPeriod(Number(e.target.value))}>
                            {availablePeriods.map((period, index) => {
            return (<material_1.MenuItem value={period} key={period}>
                                        {period} {index === 0 ? "ano" : "anos"}
                                    </material_1.MenuItem>);
        })}
                        </material_1.Select>
                    </material_1.FormControl>
                </material_1.Box>

                <RankingPanel_1.default stocks={filteredStocks} headCells={headCells} initialOrderBy={{ column: "momentum6M", direction: "desc" }} hideYearsWithProfitFilter={true} loading={loading} hideFavorites hideFilter showDividendFilter={undefined} lastYears={undefined} setLastYears={undefined}/>
            </material_1.Stack>
        </div>);
}
exports.default = AcquirersMultiple;
