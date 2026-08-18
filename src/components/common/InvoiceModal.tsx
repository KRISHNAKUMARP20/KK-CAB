import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  Car, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InvoiceModal: React.FC = () => {
  const { showInvoiceModal, setShowInvoiceModal, invoiceBooking } = useApp();

  if (!showInvoiceModal || !invoiceBooking) return null;

  const b = invoiceBooking;
  const fb = b.fareBreakdown;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-slate-100 animate-in zoom-in-95 my-8">
        
        {/* Actions Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span className="font-heading font-black text-lg">Tax Invoice / Trip Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Bill Area */}
        <div className="space-y-6 text-xs font-sans">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg text-white">KK SMART CAB TECHNOLOGIES</span>
                <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">PAID</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">GSTIN: 07AABCK9981M1ZR • SAC: 9964 (Passenger Transport)</p>
              <p className="text-slate-400 text-[11px]">Connaught Place Central Hub, New Delhi - 110001</p>
            </div>
            <div className="text-left sm:text-right font-mono">
              <div className="font-bold text-cyan-400 text-sm">{b.bookingCode}</div>
              <div className="text-slate-400 text-[11px]">Invoice Date: {new Date(b.createdAt).toLocaleDateString()}</div>
              <div className="text-slate-400 text-[11px]">Time: {new Date(b.createdAt).toLocaleTimeString()}</div>
            </div>
          </div>

          {/* Customer & Captain Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Passenger / Billed To:</span>
              <p className="font-bold text-white mt-1">{b.userName}</p>
              <p className="text-slate-400">{b.userPhone}</p>
              {b.isCorporateExpense && (
                <div className="mt-1.5 text-[10px] bg-cyan-500/10 text-cyan-300 p-1.5 rounded border border-cyan-500/20">
                  🏢 Corporate Tag: {b.corporateExpenseTag || 'Business Expense'}
                </div>
              )}
            </div>

            <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Captain & Vehicle:</span>
              <p className="font-bold text-white mt-1">{b.driver?.name || 'Assigned Fleet Driver'}</p>
              <p className="text-slate-400">{b.driver?.vehicle.model} • <span className="font-mono text-cyan-400">{b.driver?.vehicle.licensePlate}</span></p>
              <p className="text-slate-400 text-[10px]">Commercial RTO Permit DL-NCR-2024</p>
            </div>
          </div>

          {/* Route Summary */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5"></div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Pickup Location:</span>
                <p className="font-medium text-white">{b.pickup.name} - {b.pickup.address}</p>
              </div>
            </div>

            {b.stops && b.stops.length > 0 && (
              <div className="pl-4 space-y-1 border-l border-cyan-500/30 ml-1">
                {b.stops.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5"></div>
                    <div>
                      <span className="text-[9px] text-cyan-300 uppercase">Intermediate Stop #{idx + 1}:</span>
                      <p className="text-slate-200 text-[11px]">{s.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-400 mt-1.5"></div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Drop Location:</span>
                <p className="font-medium text-white">{b.destination.name} - {b.destination.address}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Total Distance: {b.distanceKm} km</span>
              <span>Trip Duration: {b.durationMinutes} mins</span>
              <span>Category: {b.category.toUpperCase()}</span>
            </div>
          </div>

          {/* Fare Itemized Table */}
          <div className="bg-slate-950/40 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/60 text-[10px] text-slate-300 uppercase">
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-right">Calculation</th>
                  <th className="p-2.5 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {fb.baseFare > 0 && (
                  <tr>
                    <td className="p-2.5 font-medium text-white">Base Fare</td>
                    <td className="p-2.5 text-right text-slate-400">Fixed Flag Drop</td>
                    <td className="p-2.5 text-right font-mono">₹{fb.baseFare}</td>
                  </tr>
                )}
                <tr>
                  <td className="p-2.5 font-medium text-white">Distance Tariff</td>
                  <td className="p-2.5 text-right text-slate-400">{b.distanceKm} km</td>
                  <td className="p-2.5 text-right font-mono">₹{fb.distanceFare}</td>
                </tr>
                {fb.timeFare > 0 && (
                  <tr>
                    <td className="p-2.5 font-medium text-white">Ride Time Tariff</td>
                    <td className="p-2.5 text-right text-slate-400">{b.durationMinutes} mins</td>
                    <td className="p-2.5 text-right font-mono">₹{fb.timeFare}</td>
                  </tr>
                )}
                {fb.surgeAmount > 0 && (
                  <tr>
                    <td className="p-2.5 font-medium text-cyan-300">Peak Demand Surge ({fb.surgeMultiplier}x)</td>
                    <td className="p-2.5 text-right text-slate-400">Dynamic Pricing</td>
                    <td className="p-2.5 text-right font-mono text-cyan-300">+₹{fb.surgeAmount}</td>
                  </tr>
                )}
                {fb.discount > 0 && (
                  <tr>
                    <td className="p-2.5 font-medium text-emerald-400">Promotional Discount</td>
                    <td className="p-2.5 text-right text-slate-400">Coupon applied</td>
                    <td className="p-2.5 text-right font-mono text-emerald-400">-₹{fb.discount}</td>
                  </tr>
                )}
                {fb.gstAmount > 0 && (
                  <tr>
                    <td className="p-2.5 font-medium text-white">GST Tax (SAC 9964)</td>
                    <td className="p-2.5 text-right text-slate-400">CGST + SGST</td>
                    <td className="p-2.5 text-right font-mono">₹{fb.gstAmount}</td>
                  </tr>
                )}
                {b.tip && b.tip > 0 ? (
                  <tr>
                    <td className="p-2.5 font-medium text-amber-300">Captain Gratuity / Tip</td>
                    <td className="p-2.5 text-right text-slate-400">Direct to Captain</td>
                    <td className="p-2.5 text-right font-mono">₹{b.tip}</td>
                  </tr>
                ) : null}
              </tbody>
              <tfoot>
                <tr className="bg-cyan-500/10 font-bold text-white border-t border-cyan-500/30">
                  <td className="p-3 text-sm">Grand Total Charged</td>
                  <td className="p-3 text-right text-xs text-slate-400 capitalize">{b.paymentMethod.replace('_', ' ')}</td>
                  <td className="p-3 text-right text-base font-mono text-cyan-400">
                    ₹{fb.totalFare + (b.tip || 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* QR Code Pay section */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left print:hidden animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Payment via UPI QR Code</span>
              <p className="text-[11px] text-slate-350">Scan using Google Pay or any UPI app to pay the fare or tip your driver.</p>
              <p className="text-[10px] text-slate-500 font-mono">UPI ID: kk6308608-1@oksbi • Payee: Krishna Kumar</p>
            </div>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=kk6308608-1@oksbi%26pn=Krishna%20Kumar%26cu=INR%26am=${fb.totalFare + (b.tip || 0)}`} 
              alt="UPI QR Code" 
              className="w-28 h-28 bg-white p-1.5 rounded-xl border border-slate-850 shrink-0"
            />
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] text-slate-500 pt-2">
            This is a computer-generated tax invoice and requires no physical signature.
            <br />
            For 24x7 support: support@kksmartcab.com | Safety Helpline: +91 1800-KK-CAB
          </div>

        </div>

      </div>
    </div>
  );
};
