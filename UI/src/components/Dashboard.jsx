import React, { useState, useMemo } from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CreditCard,
  LogOut,
  PlusCircle,
  Send,
  ShieldCheck,
  User,
  Wallet
} from "lucide-react";
import Brand from "./Brand";

export default function Dashboard({
  user,
  balance,
  transactions,
  onLogout,
  onTransfer,
  onDeposit,
  onCreateAccount
}) {
  // Action tabs: "transfer" | "deposit" | "account"
  const [activeTab, setActiveTab] = useState("transfer");
  const [historyFilter, setHistoryFilter] = useState("all"); // "all" | "incoming" | "outgoing"

  // Transfer form state
  const [recipient, setRecipient] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferMessage, setTransferMessage] = useState("");
  const [transferError, setTransferError] = useState("");
  const [transferSuccess, setTransferSuccess] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  // Deposit form state
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDesc, setDepositDesc] = useState("ATM Cash Deposit");
  const [depositError, setDepositError] = useState("");
  const [depositSuccess, setDepositSuccess] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);

  // New account form state
  const [newAccountName, setNewAccountName] = useState("");
  const [accountSuccess, setAccountSuccess] = useState("");
  const [accountError, setAccountError] = useState("");

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(Math.abs(amount));

  const availableFormatted = useMemo(() => formatMoney(balance), [balance]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (historyFilter === "incoming") return transactions.filter((t) => t.type === "incoming");
    if (historyFilter === "outgoing") return transactions.filter((t) => t.type === "outgoing");
    return transactions;
  }, [transactions, historyFilter]);

  // Handle Transfer
  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    const val = Number(transferAmount);
    setTransferError("");
    setTransferSuccess("");

    if (!recipient.trim() || !recipientAccount.trim() || !val || val <= 0) {
      setTransferError("Please complete each field with a valid amount.");
      return;
    }
    if (val > balance) {
      setTransferError("This amount exceeds your available balance.");
      return;
    }

    setIsTransferring(true);
    try {
      await onTransfer({
        recipient: recipient.trim(),
        recipientAccount: recipientAccount.trim(),
        amount: val,
        description: transferMessage.trim() || "Peer Transfer"
      });
      setTransferSuccess(`Transfer of ${formatMoney(val)} to ${recipient.trim()} completed.`);
      setRecipient("");
      setRecipientAccount("");
      setTransferAmount("");
      setTransferMessage("");
    } catch (err) {
      setTransferError(err.message || "Transfer failed");
    } finally {
      setIsTransferring(false);
    }
  };

  // Handle Deposit
  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    const val = Number(depositAmount);
    setDepositError("");
    setDepositSuccess("");

    if (!val || val <= 0) {
      setDepositError("Deposit amount must be greater than zero.");
      return;
    }

    setIsDepositing(true);
    try {
      await onDeposit({
        amount: val,
        description: depositDesc.trim() || "Cash Deposit"
      });
      setDepositSuccess(`Successfully deposited ${formatMoney(val)} into your account.`);
      setDepositAmount("");
    } catch (err) {
      setDepositError(err.message || "Deposit failed");
    } finally {
      setIsDepositing(false);
    }
  };

  // Handle Account Create
  const handleCreateAccountSubmit = async (e) => {
    e.preventDefault();
    if (!newAccountName.trim()) {
      setAccountError("Account name is required.");
      return;
    }
    setAccountError("");
    setAccountSuccess("");
    try {
      await onCreateAccount(newAccountName.trim());
      setAccountSuccess(`Account "${newAccountName}" created successfully!`);
      setNewAccountName("");
    } catch (err) {
      setAccountError(err.message || "Could not create account");
    }
  };

  const getInitials = (name) => {
    if (!name) return "NB";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <main className="min-h-dvh bg-[#f7f9fb] text-slate-950">
      {/* Header Bar */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-30">
        <div className="mx-auto flex h-[82px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <Brand />

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">{user?.name || "Alex Morgan"}</p>
              <p className="text-xs text-slate-400">
                {user?.account?.name || "Everyday Account"}
              </p>
            </div>
            <span className="grid size-10 place-items-center rounded-full bg-sky-50 text-sm font-bold text-sky-700 select-none">
              {getInitials(user?.name)}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="ml-1 grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-[1240px] px-5 py-9 sm:px-8 sm:py-12">
        {/* Welcome Section */}
        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold text-sky-700">
              Good day, {user?.name?.split(" ")[0] || "Alex"}
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.045em] sm:text-[2.6rem]">
              Here’s your money, at a glance.
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveTab("deposit");
                document.getElementById("action-panel")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex h-12 items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
            >
              <PlusCircle size={17} />
              Deposit funds
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("transfer");
                document.getElementById("action-panel")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex h-12 items-center gap-2 rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,132,199,0.20)] transition hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <Send size={17} aria-hidden="true" />
              Transfer money
            </button>
          </div>
        </section>

        {/* Hero Balance Card */}
        <section className="balance-card relative mb-7 overflow-hidden rounded-[1.75rem] bg-sky-600 px-6 py-7 text-white shadow-[0_24px_55px_rgba(2,132,199,0.20)] sm:px-9 sm:py-9">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-sky-100">Available balance</p>
              <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE
              </span>
            </div>

            <p className="money mt-3 text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-none tracking-[-0.055em]">
              {availableFormatted}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/20 pt-5 text-sm text-sky-100">
              <span>
                Account{" "}
                <strong className="money ml-1 font-medium text-white">
                  •• {user?.account?.accountNumber || "4832"}
                </strong>
              </span>
              <span>
                Routing{" "}
                <strong className="money ml-1 font-medium text-white">
                  {user?.account?.routingNumber || "021000021"}
                </strong>
              </span>
              <span>
                Currency{" "}
                <strong className="money ml-1 font-medium text-white">
                  {user?.account?.currency || "USD"}
                </strong>
              </span>
            </div>
          </div>
        </section>

        {/* 2-Column Grid */}
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.45fr)_minmax(330px,0.85fr)]">
          {/* Left Column: Transaction Activity */}
          <section className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.04)] sm:p-7">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-sky-700">Activity</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">
                  Transaction history
                </h2>
              </div>

              {/* Filter Pills */}
              <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setHistoryFilter("all")}
                  className={`rounded-md px-3 py-1.5 transition ${historyFilter === "all"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  All ({transactions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter("incoming")}
                  className={`rounded-md px-3 py-1.5 transition ${historyFilter === "incoming"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  Deposits
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter("outgoing")}
                  className={`rounded-md px-3 py-1.5 transition ${historyFilter === "outgoing"
                    ? "bg-white text-sky-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  Transfers
                </button>
              </div>
            </div>

            {/* List */}
            <div>
              {filteredTransactions.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400">
                  No transactions found in this category.
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-t border-slate-100 py-4 first:border-t-0 first:pt-1 sm:gap-4 transition hover:bg-slate-50/50 rounded-xl px-2 -mx-2"
                  >
                    <span
                      className={`grid size-11 place-items-center rounded-xl ${transaction.type === "incoming"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-sky-50 text-sky-600"
                        }`}
                    >
                      {transaction.type === "incoming" ? (
                        <ArrowDownLeft size={19} aria-hidden="true" />
                      ) : (
                        <ArrowUpRight size={19} aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 sm:text-[15px]">
                        {transaction.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-400">
                        {transaction.detail} · {transaction.date}
                      </p>
                    </div>
                    <p
                      className={`money text-sm font-semibold sm:text-[15px] ${transaction.amount > 0 ? "text-emerald-600" : "text-slate-900"
                        }`}
                    >
                      {transaction.amount > 0 ? "+" : "−"}
                      {formatMoney(transaction.amount)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Right Column: Actions Panel */}
          <section
            id="action-panel"
            className="h-fit scroll-mt-24 rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.04)] sm:p-7"
          >
            {/* Panel Tabs */}
            <div className="mb-6 flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("transfer")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 transition ${activeTab === "transfer"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <Send size={14} />
                Transfer
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("deposit")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 transition ${activeTab === "deposit"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <PlusCircle size={14} />
                Deposit
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("account")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 transition ${activeTab === "account"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <CreditCard size={14} />
                Account
              </button>
            </div>

            {/* TAB 1: TRANSFER MONEY */}
            {activeTab === "transfer" && (
              <div>
                <p className="text-sm font-semibold text-sky-700">Send money</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">Make a transfer</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Move funds safely to another bank account.
                </p>

                <form onSubmit={handleTransferSubmit} className="mt-6 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">
                      Recipient name
                    </span>
                    <input
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                      placeholder="e.g. Jamie Chen"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">
                      Account number or ID
                    </span>
                    <input
                      value={recipientAccount}
                      onChange={(e) => setRecipientAccount(e.target.value)}
                      className="money h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none transition placeholder:font-sans placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                      placeholder="e.g. 7402 or Account ID"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">Amount</span>
                    <span className="flex h-12 items-center rounded-xl border border-slate-200 px-4 transition focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100">
                      <span className="money mr-2 text-sm font-semibold text-slate-400">$</span>
                      <input
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        type="number"
                        min="0.01"
                        step="0.01"
                        className="money min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        placeholder="0.00"
                        required
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">
                      Note (optional)
                    </span>
                    <input
                      value={transferMessage}
                      onChange={(e) => setTransferMessage(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                      placeholder="What is this transfer for?"
                    />
                  </label>

                  {transferError && (
                    <p className="text-xs font-medium text-rose-600 rounded-lg bg-rose-50 p-2.5">
                      {transferError}
                    </p>
                  )}
                  {transferSuccess && (
                    <p className="flex items-center gap-2 text-xs font-medium text-emerald-600 rounded-lg bg-emerald-50 p-2.5">
                      <Check size={15} aria-hidden="true" />
                      {transferSuccess}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isTransferring}
                    className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-70"
                  >
                    {isTransferring ? (
                      "Sending..."
                    ) : (
                      <>
                        <span>Send transfer</span>
                        <ArrowRight size={17} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: DEPOSIT MONEY */}
            {activeTab === "deposit" && (
              <div>
                <p className="text-sm font-semibold text-sky-700">Add funds</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">Deposit money</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Credit funds instantly to your available balance.
                </p>

                <form onSubmit={handleDepositSubmit} className="mt-6 space-y-4">
                  {/* Quick Preset Buttons */}
                  <div>
                    <span className="mb-2 block text-xs font-semibold text-slate-600">
                      Quick select amount
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 500, 1000, 2500].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setDepositAmount(preset.toString())}
                          className="money rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-700 transition hover:border-sky-500 hover:bg-sky-50 hover:text-sky-700"
                        >
                          +${preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">
                      Deposit Amount
                    </span>
                    <span className="flex h-12 items-center rounded-xl border border-slate-200 px-4 transition focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100">
                      <span className="money mr-2 text-sm font-semibold text-slate-400">$</span>
                      <input
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        type="number"
                        min="1"
                        step="0.01"
                        className="money min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        placeholder="0.00"
                        required
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">
                      Deposit Source / Note
                    </span>
                    <input
                      value={depositDesc}
                      onChange={(e) => setDepositDesc(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                      placeholder="e.g. ATM Cash Deposit, Payroll"
                    />
                  </label>

                  {depositError && (
                    <p className="text-xs font-medium text-rose-600 rounded-lg bg-rose-50 p-2.5">
                      {depositError}
                    </p>
                  )}
                  {depositSuccess && (
                    <p className="flex items-center gap-2 text-xs font-medium text-emerald-600 rounded-lg bg-emerald-50 p-2.5">
                      <Check size={15} aria-hidden="true" />
                      {depositSuccess}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isDepositing}
                    className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,132,199,0.20)] transition hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-70"
                  >
                    {isDepositing ? (
                      "Processing..."
                    ) : (
                      <>
                        <span>Complete deposit</span>
                        <ArrowRight size={17} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: ACCOUNT DETAILS */}
            {activeTab === "account" && (
              <div>
                <p className="text-sm font-semibold text-sky-700">Overview</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">Account info</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Manage your banking accounts and details.
                </p>

                <div className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4 border border-slate-100 text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Account Name</span>
                    <span className="font-semibold text-slate-900">
                      {user?.account?.name || "Everyday Account"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Holder Name</span>
                    <span className="font-semibold text-slate-900">{user?.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Email</span>
                    <span className="font-semibold text-slate-900">{user?.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Status</span>
                    <span className="font-semibold text-emerald-600">ACTIVE</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Currency</span>
                    <span className="money font-semibold text-slate-900">
                      {user?.account?.currency || "USD"}
                    </span>
                  </div>
                </div>

                {/* Create Linked Account Form */}
                <form onSubmit={handleCreateAccountSubmit} className="mt-6 space-y-3">
                  <p className="text-xs font-semibold text-slate-700">Open another account</p>
                  <input
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500"
                    placeholder="e.g. High Yield Savings"
                  />
                  {accountSuccess && (
                    <p className="text-xs text-emerald-600 font-medium">{accountSuccess}</p>
                  )}
                  {accountError && (
                    <p className="text-xs text-rose-600 font-medium">{accountError}</p>
                  )}
                  <button
                    type="submit"
                    className="flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 transition hover:bg-slate-50 hover:border-slate-300"
                  >
                    <PlusCircle size={15} />
                    Create New Account
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

