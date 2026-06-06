export default function SettingsPage() {
  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold">Postavke</h1>
        <p className="text-gray-600 mt-2">
          Upravljajte postavkama vašeg računa i kluba.
        </p>
      </div>

      {/* ACCOUNT SETTINGS */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Postavke računa</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">Ime i prezime</p>
            <p className="text-lg font-medium">Robert</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">admin@a-basa.com</p>
          </div>

        </div>

        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Promijeni lozinku
        </button>
      </div>

      {/* CLUB SETTINGS */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Postavke kluba</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">Naziv kluba</p>
            <p className="text-lg font-medium">ABASA Sport</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Lokacija</p>
            <p className="text-lg font-medium">Pula</p>
          </div>

        </div>

        <button className="mt-6 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
          Uredi informacije o klubu
        </button>
      </div>

      {/* SYSTEM SETTINGS */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Sustav</h3>

        <div className="space-y-4">

          <div className="flex items-center justify-between">
            <span>Tema</span>
            <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
              Promijeni temu
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span>Notifikacije</span>
            <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
              Upravljaj notifikacijama
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
