// http://localhost:3000/api/pincode

export async function GET() {
  console.log('API is being called');
  return new Response(
      JSON.stringify({
          pincodes: [
              74400, 75600, 75500, 75300, 74700, 74900, 54000, 54782, 54700,
              54810, 54792, 54570, 44000, 44060, 44100, 44080, 44790, 46000,
              46050, 46200, 46060, 38000, 38850, 38860, 60000, 60010, 60050,
              25000, 25020, 25120, 87300, 87350, 87550, 40100, 40150, 40160,
              40170, 40250, 26000, 26100, 26200
          ]
      }),
      {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
      }
  );
}
