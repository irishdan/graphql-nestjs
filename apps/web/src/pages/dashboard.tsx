import Template from '@/components/layout/template';
import { LocationForm } from '@/components/form/location-form.tsx';

export default function Dashboard() {
  return (
    <Template>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="mx-auto mt-3 mb-3 w-full max-w-6xl rounded-xl0">
          <h1 className="text-3xl">Plan your trip</h1>
        </div>
        <div>
          <div className="space-y-6m mx-auto mt-3 mb-3 w-full max-w-6xl">
            <LocationForm />
          </div>
        </div>
      </div>
    </Template>
  );
}
