// Freebie Project Configuration (Social Proof Thermometer)
export const freebieProjectId = 'dbojiegvkyvbmbivmppi';
export const freebiePublicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRib2ppZWd2a3l2Ym1iaXZtcHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NDA0NDMsImV4cCI6MjA3NzQxNjQ0M30.vdXxqOosxNSzrt3c-VaQbeDuAltLtaP5Tj-UKx-sWQQ';

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

export function getFreebieSupabaseClient() {
  const FREEBIE_URL = `https://${freebieProjectId}.supabase.co`;
  
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
        const url = `${FREEBIE_URL}/rest/v1/${table}?${buildQuery()}`;
        const result = await makeRequest('GET', url, {
          'apikey': freebiePublicAnonKey,
          'Authorization': `Bearer ${freebiePublicAnonKey}`,
          'Content-Type': 'application/json',
        });
        
        if (singleMode || maybeSingleMode) {
          const data = result.data as any[];
          return { data: data && data.length > 0 ? data[0] : null, error: result.error };
        }
        return result;
      };

      let updateValues: any = null;
      let insertValues: any = null;

      const executeUpdate = async () => {
        const filterParams: string[] = [];
        filters.forEach(f => {
          filterParams.push(`${encodeURIComponent(f.col)}=${encodeURIComponent(f.op)}.${encodeURIComponent(f.val)}`);
        });
        const url = `${FREEBIE_URL}/rest/v1/${table}?${filterParams.join('&')}`;
        return makeRequest('PATCH', url, {
          'apikey': freebiePublicAnonKey,
          'Authorization': `Bearer ${freebiePublicAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        }, JSON.stringify(updateValues));
      };

      const executeInsert = async () => {
        return makeRequest('POST', `${FREEBIE_URL}/rest/v1/${table}`, {
          'apikey': freebiePublicAnonKey,
          'Authorization': `Bearer ${freebiePublicAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        }, JSON.stringify(insertValues));
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
          if (updateValues !== null) {
            return executeUpdate().then(onfulfilled, onrejected);
          } else if (insertValues !== null) {
            return executeInsert().then(onfulfilled, onrejected);
          }
          return execute().then(onfulfilled, onrejected);
        },
        insert: (values: any) => {
          insertValues = values;
          return builder;
        },
        update: (values: any) => {
          updateValues = values;
          return builder;
        },
      };

      return builder;
    },
  };
}