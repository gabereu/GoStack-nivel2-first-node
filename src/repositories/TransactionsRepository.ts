import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce(
      (reduced, transaction) => {
        if (transaction.type === 'income') {
          return {
            income: reduced.income + transaction.value,
            outcome: reduced.outcome,
          };
        }
        if (transaction.type === 'outcome') {
          return {
            income: reduced.income,
            outcome: reduced.outcome + transaction.value,
          };
        }

        return reduced;
      },
      {
        income: 0,
        outcome: 0,
      },
    );

    return {
      income: balance.income,
      outcome: balance.outcome,
      total: balance.income - balance.outcome,
    };
  }

  public create(data: Omit<Transaction, 'id'>): Transaction {
    if (data.type === 'outcome') {
      const balance = this.getBalance();

      if (balance.total < data.value) {
        throw Error('Insufficient Credits');
      }
    }

    const transaction = new Transaction(data);

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
