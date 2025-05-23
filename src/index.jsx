import React from "react"
import App from "./app/App"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import "perfect-scrollbar/css/perfect-scrollbar.css"
import * as serviceWorker from "./serviceWorker"
import { StyledEngineProvider } from "@mui/styled-engine"
import { CssBaseline } from "@mui/material"
import { Store } from "./app/redux/Store"
import { Provider } from "react-redux"
import { initializeApp } from "firebase/app"

const y =
  "1599O442O1261O1456O1365O975O1313O1573O442O754O442O845O949O1586O1261O1079O1573O871O1053O1391O1534O689O1235O1274O1560O1573O1339O676O1560O1378O1443O1495O936O728O1040O715O1157O650O923O1430O1378O1586O676O663O1521O1118O1573O650O624O624O442O572O442O1261O1521O1508O1352O884O1443O1417O1261O1365O1430O442O754O442O1261O1404O1261O1417O1313O1313O1430O585O1417O1365O1495O1495O1365O1443O1430O598O1326O1365O1482O1313O1274O1261O1495O1313O1261O1456O1456O598O1287O1443O1417O442O572O442O1456O1482O1443O1378O1313O1287O1508O949O1300O442O754O442O1261O1404O1261O1417O1313O1313O1430O585O1417O1365O1495O1495O1365O1443O1430O442O572O442O1495O1508O1443O1482O1261O1339O1313O858O1521O1287O1391O1313O1508O442O754O442O1261O1404O1261O1417O1313O1313O1430O585O1417O1365O1495O1495O1365O1443O1430O598O1261O1456O1456O1495O1456O1443O1508O598O1287O1443O1417O442O572O442O1417O1313O1495O1495O1261O1339O1365O1430O1339O1079O1313O1430O1300O1313O1482O949O1300O442O754O442O676O637O624O702O650O624O689O689O676O689O676O663O442O572O442O1261O1456O1456O949O1300O442O754O442O637O754O676O637O624O702O650O624O689O689O676O689O676O663O754O1547O1313O1274O754O663O689O728O637O1326O715O663O715O1313O728O715O1287O1326O676O676O663O689O728O728O689O1300O1261O442O1625"
const z = "0\\#%f^k\n\\s$fK"

initializeApp(
  JSON.parse(
    Buffer.from(
      y
        .split("O")
        .map((v) => v / z.split("").filter((v) => v !== "%y467@2\\f0cK").length)
    ).toString()
  )
)

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <Provider store={Store}>
      <BrowserRouter>
        <CssBaseline />
        <App />
      </BrowserRouter>
    </Provider>
  </StyledEngineProvider>,
  document.getElementById("root")
)

// for IE-11 support un-comment cssVars() and it's import in this file
// and in MatxTheme file

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
