import { appointmentRows } from "@/components/dashboard/data";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { EyeIcon } from "@/components/dashboard/icons";

export default function HistoryTable({ rows = appointmentRows }) {
  return (
    <section className="bg-[#f0f2f5]">
      <SectionHeader
        title="Appointments History"
        icon={<span className="text-xl leading-none">↑</span>}
      />

      <div className="hidden overflow-hidden md:block">
        <table className="w-full border-collapse text-left text-sm text-[#111111]">
          <thead>
            <tr className="border-b border-black/10">
              <th className="w-[25%] px-3 py-3 font-normal">Date</th>
              <th className="w-[24%] px-3 py-3 font-normal">Service</th>
              <th className="w-[9%] px-3 py-3 text-center font-normal">Duration</th>
              <th className="w-[13%] px-3 py-3 text-center font-normal">Drips Earned</th>
              <th className="w-[13%] px-3 py-3 text-center font-normal">Status</th>
              <th className="w-[16%] px-3 py-3 text-center font-normal">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.date}-${row.service}`} className="border-b border-black/10">
                <td className="px-3 py-3">{row.date}</td>
                <td className="px-3 py-3">{row.service}</td>
                <td className="px-3 py-3 text-center">{row.duration}</td>
                <td className="px-3 py-3 text-center">{row.points}</td>
                <td className="px-3 py-3 text-center">{row.status}</td>
                <td className="px-3 py-3">
                  <button type="button" className="mx-auto block text-[#111111]">
                    <span className="sr-only">View invoice for {row.service}</span>
                    <EyeIcon />
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-[#858585]">
                  Completed bookings will appear here after checkout.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="md:hidden">
        <div className="grid grid-cols-2 border-b border-black/10 text-sm">
          <div className="px-3 py-3">Date</div>
          <div className="px-3 py-3 text-center">Details</div>
        </div>
        {rows.slice(0, 4).map((row) => (
          <div key={`${row.date}-mobile`} className="grid grid-cols-2 border-b border-black/10 text-sm">
            <div className="px-3 py-3">{row.date}</div>
            <div className="flex items-center justify-center px-3 py-3">
              <button type="button" className="text-[#111111]">
                <span className="sr-only">View details for {row.service}</span>
                <EyeIcon />
              </button>
            </div>
          </div>
        ))}
        {!rows.length ? (
          <p className="px-3 py-8 text-center text-sm text-[#858585]">
            Completed bookings will appear here after checkout.
          </p>
        ) : null}
      </div>
    </section>
  );
}
