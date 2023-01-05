class Account {
  locale = navigator.language;
  createdAt = new Date();

  constructor(name, password, interestRate, movements, movementDates) {
    this.name = name;
    this.password = password;
    this.interestRate = interestRate;
    this.movements = movements;
    this.movementDates = movementDates;
  }
}

const furkan = new Account(
  "furkan",
  3429,
  1.1,
  [200, 500, 300, -100, 200, -300, -500, -600, 300, -200, 1000],
  [
    "2022-11-01T15:31:46.738Z",
    "2022-11-02T15:31:46.738Z",
    "2022-11-03T15:31:46.738Z",
    "2022-11-04T15:31:46.738Z",
    "2022-11-05T15:31:46.738Z",
    "2022-11-06T15:31:46.738Z",
    "2022-11-07T15:31:46.738Z",
    "2022-11-08T15:31:46.738Z",
    "2022-11-09T15:31:46.738Z",
    "2022-11-10T15:31:46.738Z",
    "2022-11-15T15:31:46.738Z",
  ]
);
// prettier-ignore
const akif = new Account("akif",1111,1.3,[300, -100, -300, -500, 1000, 300, -200, 500],[
  "2022-09-02T15:31:46.738Z",
  "2022-09-04T15:31:46.738Z",
  "2022-09-06T15:31:46.738Z",
  "2022-10-09T15:31:46.738Z",
  "2022-10-10T15:31:46.738Z",
  "2022-10-11T15:31:46.738Z",
  "2022-11-15T15:31:46.738Z",
  "2022-11-16T15:31:46.738Z",
]);
// prettier-ignore
const elif = new Account("elif",1200,1.5,[200,500,300,100,-5000,3000,1000,-30,-500,-200,700],[
  "2022-08-01T15:31:46.738Z",
  "2022-09-02T15:31:46.738Z",
  "2022-09-03T15:31:46.738Z",
  "2022-10-04T15:31:46.738Z",
  "2022-10-06T15:31:46.738Z",
  "2022-10-09T15:31:46.738Z",
  "2022-11-10T15:31:46.738Z",
  "2022-11-11T15:31:46.738Z",
  "2022-11-13T15:31:46.738Z",
  "2022-11-15T15:31:46.738Z",
  "2022-11-16T15:31:46.738Z",
]);

const accounts = [furkan, akif, elif];
console.log(accounts);

/***************************** */
let currentAccount;
let sorted = false;
class App {
  loginInput = document.querySelector(".form__login");
  loginPassword = document.querySelector(".form__password");
  loginForm = document.querySelector(".form");
  app = document.querySelector(".app");
  nav = document.querySelector(".nav");
  movementsContainer = document.querySelector(".movements__list");
  IncomeLabel = document.querySelector(".summary__income");
  OutcomeLabel = document.querySelector(".summary__withdrawal");
  interestLabel = document.querySelector(".summary__interest");
  balanceLabel = document.querySelector(".balance__text");
  formTransfer = document.querySelector(".operations__form--transfer");
  formLoan = document.querySelector(".operations__form--loan");
  formClose = document.querySelector(".operations__form--close");
  transferTo = document.querySelector(".operations__transferTo");
  amountTransfer = document.querySelector(".operations__amount--transfer");
  amountLoan = document.querySelector(".operations__amount--loan");
  accountName = document.querySelector(".operations__accountName");
  accountPassword = document.querySelector(".operations__accountPassword");
  labelDate = document.querySelector(".datetime__time");
  summaryBtn = document.querySelector(".summary__btn");
  timerBtn = document.querySelector(".note__btn");

  constructor() {
    this.showDate();
    this.loginForm.addEventListener("submit", this.login.bind(this));
    this.summaryBtn.addEventListener("click", this.sortMovements.bind(this));
    this.formTransfer.addEventListener("submit", this.transferMoney.bind(this));
    this.formLoan.addEventListener("submit", this.loanMoney.bind(this));
    this.formClose.addEventListener("submit", this.closeAccount.bind(this));
    this.timerBtn.addEventListener("click", this.logoutAccount.bind(this));
  }

  showDate() {
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };

    const locale = navigator.language;
    const now = new Date();
    this.labelDate.textContent = new Intl.DateTimeFormat(
      locale,
      options
    ).format(now);
  }

  login(e) {
    e.preventDefault();
    currentAccount = accounts.find(
      (account) => account.name.toLowerCase() === this.loginInput.value
    );
    if (!currentAccount) return;

    if (currentAccount.password === +this.loginPassword.value) {
      this.app.style.opacity = 1;
      this.nav.style.opacity = 0;
    }
    this.clearInputs();
    this.loginPassword.blur();
    this.updateUI(currentAccount);
  }

  displayMovements(account, sorted = false) {
    this.movementsContainer.innerHTML = "";

    const movs = sorted
      ? account.movements.slice().sort((a, b) => a - b)
      : account.movements;

    movs.forEach((movement, i) => {
      const type = movement > 0 ? "deposit" : "withdrawal";
      const movementDates = currentAccount.movementDates[i];
      let html = `
        <li class="movements__item">
            <p class="movements__action movements__${type}">
                <span class="movements__number">${i + 1}</span>${type} 
            </p>
            <p class="movements__date">${new Intl.DateTimeFormat(
              "tr-TR"
            ).format(new Date(movementDates))}</p>
            <p class="movements__value">${movement}₺</p>
        </li>
        `;

      this.movementsContainer.insertAdjacentHTML("afterbegin", html);
    });
  }

  calcIncome(account) {
    const totalIncome = account.movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    this.IncomeLabel.textContent = `${totalIncome}₺`;
  }

  calcWithdrawal(account) {
    const totalWithdrawal = account.movements
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
    this.OutcomeLabel.textContent = `${Math.abs(totalWithdrawal)}₺`;
  }

  calcInterest(account) {
    const totalIncome = account.movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    const interest = (totalIncome * account.interestRate) / 100;
    this.interestLabel.textContent = `${interest.toFixed(1)}₺`;
  }

  calcTotalBalance(account) {
    const totalBalance = account.movements.reduce((acc, mov) => acc + mov, 0);
    this.balanceLabel.textContent = `${totalBalance}₺`;
    currentAccount.totalBalance = +totalBalance;
  }

  updateUI(account) {
    this.displayMovements(account);
    this.calcIncome(account);
    this.calcWithdrawal(account);
    this.calcInterest(account);
    this.calcTotalBalance(account);
    this.showDate();
  }

  clearInputs() {
    this.loginInput.value = this.loginPassword.value = "";
  }

  transferMoney(e) {
    const clearInputs = () => {
      this.transferTo.value = this.amountTransfer.value = "";
    };
    e.preventDefault();
    const transferTo = this.transferTo.value;
    const amount = +this.amountTransfer.value;

    const receiverAcc = accounts.find((acc) => acc.name === transferTo);
    if (!receiverAcc) return;

    if (receiverAcc && amount > 0 && currentAccount.totalBalance >= amount) {
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
      currentAccount.movementDates.push(new Date().toISOString());
      receiverAcc.movementDates.push(new Date().toISOString());
      this.updateUI(currentAccount);
    }
    clearInputs();
  }

  loanMoney(e) {
    e.preventDefault();

    const amount = +this.amountLoan.value;
    const maxValue = (currentAccount.totalBalance * 10) / 100;

    if (amount > 0 && maxValue >= amount) {
      currentAccount.movements.push(amount);

      currentAccount.movementDates.push(new Date().toISOString());
      this.updateUI(currentAccount);
    }
    this.amountLoan.value = "";
  }

  closeAccount(e) {
    e.preventDefault();
    const account = this.accountName.value;
    const password = +this.accountPassword.value;

    if (
      currentAccount.name === account &&
      currentAccount.password === password
    ) {
      const sure = prompt(
        "Hesabınızı kapatmak istediğinizden emin misiniz ? Eğer eminseniz aşağıdaki butona evet yazınız. Bu işlem geri alınamaz."
      );
      if (sure.toLowerCase() === "evet") {
        this.accountName.value = this.accountPassword.value = "";
        const index = accounts.findIndex((acc) => acc.name === account);
        accounts.splice(index, 1);
        this.app.style.opacity = 0;
        this.nav.style.opacity = 1;
      }
    }
  }

  sortMovements() {
    this.sorted = true;
    this.displayMovements(currentAccount, sorted);
    sorted = !sorted;
    if (sorted) {
      this.summaryBtn.textContent = "Sırala ↓";
    } else {
      this.summaryBtn.textContent = "Sırala ↑";
    }
  }

  logoutAccount() {
    this.app.style.opacity = 0;
    this.nav.style.opacity = 1;
  }
}

const app = new App();
