const nf = new Intl.NumberFormat('fa-IR');
export const faNumber = (n: number) => nf.format(n);

const df = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'long' });
export const faDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : df.format(d);
};
