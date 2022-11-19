import CurrencyFormat from "react-currency-format";

import { centavos2reais, reais2centavos } from "utils/centavos2reais";
import { DashboardLayout } from "components/DashboardLayout";
import { Button } from "components/Button";
import { Input } from "components/Input";
import { api } from "lib/axios";

export default function MakeTransaction() {
	async function doTransaction(e: React.FormEvent) {
		const formData = new FormData(e.target as HTMLFormElement);
		const formEntries = {
			username_to_cash_in_to: formData.get("username_to_cash_in_to") as string,
			amount_to_cash_out: reais2centavos(
				Number(formData.get("amount_to_cash_out") as string)
			),
		};

		try {
			const { data } = await api.post<MakeTransactionResponse>(
				"/api/transactions/cash-out",
				formEntries
			);

			if (!data.success) return alert(data.message);

			alert(
				"Transferência concluída com sucesso! Sua nova balança é: " +
					centavos2reais(data.balance)
			);
		} catch (error) {
			console.error("Error on doTransaction: ", error);

			alert("There was an error!");
		}
	}

	return (
		<div className="w-full h-full">
			<form className="flex flex-col gap-7 w-full h-full font-medium text-secondary tracking-wide">
				<label className="flex flex-col">
					Para quem você quer transferir?
					<Input
						placeholder="Nome de usuário"
						name="username_to_cash_in_to"
						type="text"
					/>
				</label>

				<label className="flex flex-col">
					Qual o valor da transferência?
					<CurrencyFormat
						className="mt-3 h-12 border-lightgray rounded-[5px] border-solid border-[1px] px-5 py-2"
						name="amount_to_cash_out"
						allowNegative={false}
						thousandSeparator="."
						decimalSeparator=","
						displayType="input"
						decimalScale={2}
						prefix="R$ "
						min={0}
					/>
				</label>

				<Button.Primary
					onPointerUp={doTransaction}
					className="mt-auto"
					title="Transferir"
				/>
			</form>
		</div>
	);
}

MakeTransaction.getLayout = function getLayout(page: JSX.Element) {
	return (
		<DashboardLayout buttonActivatedName="make-transaction">
			{page}
		</DashboardLayout>
	);
};

type MakeTransactionResponse =
	| {
			message: string;
			success: false;
	  }
	| {
			balance: number;
			success: true;
	  };
