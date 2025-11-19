// DIY Generations Project Configuration
export const diyProjectId = 'oqjgvzaedlwarmyjlsoz';
export const diyPublicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xamd2emFlZGx3YXJteWpsc296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODYxMDYsImV4cCI6MjA3Nzc2MjEwNn0.GqxEM1JbbCcBj5m2sORBIvWX_JD5JrdYkkdidvp5Hzc';

// Safe fetch wrapper that only executes in browser
const safeFetch = async (url: string, options: any) => {
  if (typeof window === 'undefined') {
    return { ok: false, status: 500, json: async () => null };
  }
  try {
    return await fetch(url, options);
  } catch (err) {
    return { ok: false, status: 500, json: async () => null, error: err };
  }
};

export function getDIYSupabaseClient() {
  const DIY_URL = `https://${diyProjectId}.supabase.co`;
  
  return {
    from: (table: string) => {
      let selectFields = '*';
      const filters: any[] = [];
      let orderCol: string | null = null;
      let orderAsc = true;
      let limitVal: number | null = null;
      let singleMode = false;
      let maybeSingleMode = false;

      const buildQuery = () => {
        const params: string[] = [`select=${encodeURIComponent(selectFields)}`];
        filters.forEach(f => {
          params.push(`${encodeURIComponent(f.col)}=${encodeURIComponent(f.op)}.${encodeURIComponent(f.val)}`);
        });
        if (orderCol) {
          params.push(`order=${encodeURIComponent(orderCol)}.${orderAsc ? 'asc' : 'desc'}`);
        }
        if (limitVal) {
          params.push(`limit=${limitVal}`);
        }
        return params.join('&');
      };

      const makeRequest = async (method: string, url: string, headers: Record<string, string>, body?: any): Promise<any> => {
        try {
          const response: any = await safeFetch(url, {
            method,
            headers,
            body,
          });

          if (!response.ok) {
            return { data: null, error: new Error(`HTTP ${response.status}`) };
          }

          const data = await response.json();
          return { data, error: null };
        } catch (err) {
          return { data: null, error: err };
        }
      };

      const execute = async () => {
        const url = `${DIY_URL}/rest/v1/${table}?${buildQuery()}`;
        const result = await makeRequest('GET', url, {
          'apikey': diyPublicAnonKey,
          'Authorization': `Bearer ${diyPublicAnonKey}`,
          'Content-Type': 'application/json',
        });
        
        if (singleMode || maybeSingleMode) {
          const data = result.data as any[];
          return { data: data && data.length > 0 ? data[0] : null, error: result.error };
        }
        return result;
      };

      const builder: any = {
        select: (fields?: string) => {
          selectFields = fields || '*';
          return builder;
        },
        eq: (col: string, val: any) => {
          filters.push({ col, op: 'eq', val });
          return builder;
        },
        order: (col: string, opts?: { ascending?: boolean }) => {
          orderCol = col;
          orderAsc = opts?.ascending !== false;
          return builder;
        },
        limit: (count: number) => {
          limitVal = count;
          return builder;
        },
        single: () => {
          singleMode = true;
          return builder;
        },
        maybeSingle: () => {
          maybeSingleMode = true;
          return builder;
        },
        then: (onfulfilled: any, onrejected?: any) => {
          return execute().then(onfulfilled, onrejected);
        },
        insert: (values: any) => {
          return makeRequest('POST', `${DIY_URL}/rest/v1/${table}`, {
            'apikey': diyPublicAnonKey,
            'Authorization': `Bearer ${diyPublicAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          }, JSON.stringify(values));
        },
        update: (values: any) => {
          const url = `${DIY_URL}/rest/v1/${table}?${buildQuery()}`;
          return makeRequest('PATCH', url, {
            'apikey': diyPublicAnonKey,
            'Authorization': `Bearer ${diyPublicAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          }, JSON.stringify(values));
        },
      };

      return builder;
    },
    storage: {
      from: (bucket: string) => {
        const makeRequest = async (method: string, url: string, headers: Record<string, string>, body?: any): Promise<any> => {
          try {
            const response: any = await safeFetch(url, {
              method,
              headers,
              body,
            });

            if (!response.ok) {
              return { data: null, error: new Error(`HTTP ${response.status}`) };
            }

            const data = await response.json();
            return { data, error: null };
          } catch (err) {
            return { data: null, error: err };
          }
        };

        return {
          upload: (path: string, file: any) => {
            return makeRequest('POST', `${DIY_URL}/storage/v1/object/${bucket}/${path}`, {
              'apikey': diyPublicAnonKey,
              'Authorization': `Bearer ${diyPublicAnonKey}`,
            }, file);
          },
          getPublicUrl: (path: string) => ({
            data: { publicUrl: `${DIY_URL}/storage/v1/object/public/${bucket}/${path}` },
          }),
        };
      },
    },
  };
}
