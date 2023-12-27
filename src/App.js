import './App.css';
import {Button, Form, ProgressBar, Spinner, Table} from "react-bootstrap";
import React, {useState} from "react";
import Result from "./Components/Result/Result";
import Creator from "./Components/Creator/Creator";

function App() {
    const [wallets, setWallets] = useState([])
    const [results, setResults] = useState([])
    const [progress, setProgress] = useState(0)
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async (wallet) => {
        await new Promise(r => setTimeout(r, 250))

        try {
            return await fetch(`https://airdrop-api.jup.ag/allocation/${wallet}`, {
                "headers": {
                    "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\""
                },
                "referrer": "https://airdrop.jup.ag/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET"
            })
        } catch (e) {
            if (e instanceof TypeError && e.message === "Failed to fetch") {
                await new Promise(r => setTimeout(r, 10000))
                return await fetchData(wallet);
            }
        }
    }
    const onCLickCheckHandler = async () => {
        setProgress(0)
        setIsLoading(true)
        const walletsStats = []
        let total = 0

        for (const wallet of wallets) {
            await setProgress(prevState => prevState + 1)
            if (wallet === "") continue

            const response = await fetchData(wallet)
            const responseJSON = await response.json().catch(() => null);

            if (responseJSON) {
                walletsStats.push({
                    wallet: wallet,
                    amount: responseJSON.tokens_final,
                    eligible: true
                })
                total += Number(responseJSON.tokens_final)
            } else {
                walletsStats.push({
                    wallet: wallet,
                    amount: 0,
                    eligible: false
                })
            }
        }

        setTotal(total)
        setResults(walletsStats)
        setIsLoading(false)
    }

    return (
        <div className="App p-5 d-flex justify-content-center align-items-center text-center flex-column">
            <h3>$JUP Airdrop Checker</h3>
            <div>
                <Form className="mb-3">
                    <Form.Label className="text-white"><h5>Wallets</h5></Form.Label>
                    <Form.Control onChange={e => setWallets(e.target.value.toLowerCase().split("\n"))}
                                  style={{width: 500, height: 300, resize: "none"}} as="textarea"/>
                </Form>
                <Button className="w-25" onClick={onCLickCheckHandler}>{isLoading ? <Spinner animation="grow" size="sm"/> : "Check"}</Button>
                {isLoading && <ProgressBar className="mt-3" animated now={progress} max={wallets.length} />}
            </div>
            <div className="mt-3">
                <Creator/>
            </div>
            {results.length !== 0 && (
                <div>
                    <h5 className="mt-3">Results</h5>
                    <h5 className="mb-3">{`Total: ${total} $JUP`}</h5>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Wallet</th>
                            <th>Amount</th>
                            <th>Eligible</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((result, index) => <Result key={index} result={result} index={index}/>)}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
}

export default App;
