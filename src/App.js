import './App.css';
import {Form, Table, Button, Spinner} from "react-bootstrap";
import React, {useState} from "react";
import Result from "./Components/Result/Result";
import Creator from "./Components/Creator/Creator";

function App() {
    const [wallets, setWallets] = useState([])
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const onCLickCheckHandler = async () => {
        setIsLoading(true)
        const walletsStats = []

        for (const wallet of wallets) {
            if (wallet === "") continue

            const response = await fetch(`https://jup-airdrop.zhen8558.workers.dev/allocation/${wallet}`, {
                "headers": {
                    "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\""
                },
                "referrer": "https://airdrop.jup.ag/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "omit"
            });

            let responseJSON = null

            try {
                responseJSON = await response.json()
            } catch (e) {

            }

            if (responseJSON) {
                walletsStats.push({
                    wallet: wallet,
                    amount: responseJSON.tokens_final,
                    eligible: true
                })
            } else {
                walletsStats.push({
                    wallet: wallet,
                    amount: 0,
                    eligible: false
                })
            }
        }

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
            </div>
            <div className="mt-3">
                <Creator/>
            </div>
            {results.length !== 0 && (
                <div>
                    <h5 className="mt-3">Results</h5>
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
