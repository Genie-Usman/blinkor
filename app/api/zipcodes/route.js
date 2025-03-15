// http://localhost:3000/api/zincodes

export async function GET() {
  console.log('API is being called');
  return new Response(
      JSON.stringify({
          zipcodes: [
            {
              "postal_code": "44000",
              "city": "Islamabad",
              "district": "Islamabad Capital Territory"
            },
            {
              "postal_code": "75000",
              "city": "Karachi",
              "district": "Karachi South"
            },
            {
              "postal_code": "54000",
              "city": "Lahore",
              "district": "Lahore"
            },
            {
              "postal_code": "46000",
              "city": "Rawalpindi",
              "district": "Rawalpindi"
            },
            {
              "postal_code": "25000",
              "city": "Peshawar",
              "district": "Peshawar"
            },
            {
              "postal_code": "60000",
              "city": "Multan",
              "district": "Multan"
            },
            {
              "postal_code": "50250",
              "city": "Wah Cantt",
              "district": "Rawalpindi"
            },
            {
              "postal_code": "64000",
              "city": "Sargodha",
              "district": "Sargodha"
            },
            {
              "postal_code": "66000",
              "city": "Dera Ismail Khan",
              "district": "Dera Ismail Khan"
            },
            {
              "postal_code": "70000",
              "city": "Sukkur",
              "district": "Sukkur"
            },
            {
              "postal_code": "40100",
              "city": "Sargodha",
              "district": "Sargodha"
            },
            {
              "postal_code": "12345",
              "city": "New York City",
              "district": "New York"
            }
          ]
          
      }),
      {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
      }
  );
}
