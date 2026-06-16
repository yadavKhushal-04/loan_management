// reusable component — used for both active and previous loans
const PaymentHistoryGrid = ({ loan }) => {

    const generateMonths = (startDate, durationMonths) => {
        const months = []
        const start = new Date(startDate)
        for (let i = 0; i < durationMonths; i++) {
            const d = new Date(start.getFullYear(), start.getMonth() + i, 1)
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            const label = d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
            months.push({ key, label })
        }
        return months
    }

    const currentMonth = new Date().toISOString().substring(0, 7)  // "YYYY-MM"
    const months = generateMonths(loan.startDate || loan.createdAt, loan.durationMonths)
    const payments = loan.payments || []

    const getStatus = (monthKey) => {
        const payment = payments.find(p => p.monthFor === monthKey)
        if (payment) {
            // compare paid month with the month it was for
            const paidMonth = new Date(payment.paidDate).toISOString().substring(0, 7)
            return paidMonth <= monthKey ? 'ontime' : 'late'
        }
        if (monthKey <= currentMonth) return 'missed'
        return 'upcoming'
    }

    const statusStyles = {
        ontime:   'bg-green-100 text-green-700 border border-green-200',
        late:     'bg-orange-100 text-orange-700 border border-orange-200',
        missed:   'bg-red-100 text-red-700 border border-red-200',
        upcoming: 'bg-gray-100 text-gray-400 border border-gray-200'
    }

    const statusIcons = {
        ontime:   '✓',
        late:     '⚠',
        missed:   '✗',
        upcoming: '–'
    }

    return (
        <div>
            {/* legend */}
            <div className="flex gap-4 mb-3 text-xs flex-wrap">
                <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block"></span>
                    On time
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block"></span>
                    Late
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
                    Missed
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block"></span>
                    Upcoming
                </span>
            </div>

            {/* month grid */}
            <div className="grid grid-cols-4 gap-2">
                {months.map(({ key, label }) => {
                    const status = getStatus(key)
                    const payment = payments.find(p => p.monthFor === key)
                    return (
                        <div
                            key={key}
                            className={`rounded-lg p-2.5 text-center text-xs ${statusStyles[status]}`}
                            title={payment
                                ? `Paid ₹${payment.amount} on ${new Date(payment.paidDate).toLocaleDateString('en-IN')} via ${payment.method?.toUpperCase()}`
                                : status === 'missed' ? 'No payment recorded' : 'Not due yet'
                            }
                        >
                            <p className="font-bold text-sm">{statusIcons[status]}</p>
                            <p className="mt-0.5">{label}</p>
                            {payment && (
                                <>
                                    <p className="mt-0.5 font-medium">₹{payment.amount.toLocaleString()}</p>
                                    <p className="mt-0.5 text-xs opacity-70">
                                        {new Date(payment.paidDate).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short'
                                    })}
                                    </p>
                                </>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PaymentHistoryGrid