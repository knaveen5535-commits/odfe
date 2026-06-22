export default function Pricing() {
  return (
    <div className="py-16 px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Pricing</h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            { name: 'Basic', price: '$29/mo', features: ['Up to 3 employees', 'Basic reports', 'Email support'] },
            { name: 'Pro', price: '$79/mo', features: ['Up to 10 employees', 'Advanced reports', 'Priority support', 'KDS integration'] },
            { name: 'Enterprise', price: 'Custom', features: ['Unlimited employees', 'Full analytics', 'Dedicated support', 'Custom integrations'] },
          ].map(plan => (
            <div key={plan.name} className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-3xl font-bold text-blue-600 my-4">{plan.price}</p>
              <ul className="text-left space-y-2 mb-6">
                {plan.features.map(f => <li key={f} className="text-gray-600">✓ {f}</li>)}
              </ul>
              <button className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700">Get Started</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
