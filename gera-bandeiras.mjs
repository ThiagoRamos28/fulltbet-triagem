// Regenera o bloco de bandeiras embutido no index.html.
//
// Por que embutir em vez de apontar para um CDN: as 52 bandeiras somam 14KB em WebP, e embutindo
// elas a página não passa a depender de um servidor de imagem em tempo de execução. Um dia sem o
// flagcdn no ar não vira uma lista de triagem sem bandeira.
//
// Quando rodar: quando um país novo aparecer na base. Sem entrada no mapa, o card não quebra —
// cai para a sigla em texto (ver `bandeiraHtml` no index.html). Para descobrir os que faltam:
//
//   select distinct pais from (
//     select pais from triagem
//     union all select pais from lay0x1_diario
//     union all select pais from lay_visitante_diario
//   ) t order by pais;
//
// Uso:  node gera-bandeiras.mjs          (reescreve o bloco no index.html)
//       node gera-bandeiras.mjs --check  (só confere se está em dia, não escreve)

import fs from 'node:fs';

// Nome do país exatamente como a API grava, para código do flagcdn. Inglaterra e Escócia não têm
// código ISO de país — o flagcdn atende as duas por `gb-eng`/`gb-sct`, e é por isso que emoji de
// bandeira não serve aqui (as duas caem na mesma bandeira preta genérica).
const MAPA = {
  'Algeria': 'dz', 'Argentina': 'ar', 'Austria': 'at', 'Azerbaijan': 'az', 'Belgium': 'be',
  'Bolivia': 'bo', 'Brazil': 'br', 'Bulgaria': 'bg', 'Chile': 'cl', 'China': 'cn',
  'Colombia': 'co', 'Costa Rica': 'cr', 'Croatia': 'hr', 'Cyprus': 'cy', 'Czech Republic': 'cz',
  'Denmark': 'dk', 'Ecuador': 'ec', 'England': 'gb-eng', 'Estonia': 'ee', 'Finland': 'fi',
  'France': 'fr', 'Germany': 'de', 'Greece': 'gr', 'Hungary': 'hu', 'Italy': 'it',
  'Japan': 'jp', 'Lithuania': 'lt', 'Malaysia': 'my', 'Mexico': 'mx', 'Netherlands': 'nl',
  'Norway': 'no', 'Paraguay': 'py', 'Peru': 'pe', 'Poland': 'pl', 'Portugal': 'pt',
  'Qatar': 'qa', 'Republic of Ireland': 'ie', 'Romania': 'ro', 'Saudi Arabia': 'sa',
  'Scotland': 'gb-sct', 'Serbia': 'rs', 'Slovakia': 'sk', 'South Korea': 'kr', 'Spain': 'es',
  'Sweden': 'se', 'Switzerland': 'ch', 'Thailand': 'th', 'Turkey': 'tr', 'USA': 'us',
  'Ukraine': 'ua', 'Uruguay': 'uy', 'Venezuela': 've',
};

const LARGURA = 80;                 // 80px para uma caixa de 22px: nítido até 3x
const INICIO = '/* BANDEIRAS:INICIO — bloco gerado por gera-bandeiras.mjs, não editar à mão */';
const FIM = '/* BANDEIRAS:FIM */';

// Cabeçalho WebP: "RIFF" …… "WEBP" e depois o formato. Vale conferir: algumas bandeiras são
// legitimamente minúsculas (a Polônia tem 44 bytes — duas faixas comprimem a quase nada), então
// tamanho pequeno não distingue imagem boa de erro servido como imagem. Dimensão distingue.
function inspecionaWebp(buf) {
  if (buf.length < 30) return null;
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
  const fmt = buf.toString('ascii', 12, 16);
  if (fmt === 'VP8L') {
    const b = buf.readUInt32LE(21);
    return { fmt, largura: (b & 0x3fff) + 1, altura: ((b >> 14) & 0x3fff) + 1 };
  }
  if (fmt === 'VP8 ') {
    return { fmt, largura: buf.readUInt16LE(26) & 0x3fff, altura: buf.readUInt16LE(28) & 0x3fff };
  }
  if (fmt === 'VP8X') {
    return { fmt, largura: buf.readUIntLE(24, 3) + 1, altura: buf.readUIntLE(27, 3) + 1 };
  }
  return null;
}

async function baixar(codigo) {
  const url = `https://flagcdn.com/w${LARGURA}/${codigo}.webp`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${codigo}: HTTP ${res.status} em ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const info = inspecionaWebp(buf);
  if (!info) throw new Error(`${codigo}: resposta não é WebP válido (${buf.length} bytes)`);
  if (info.largura !== LARGURA) throw new Error(`${codigo}: largura ${info.largura}, esperava ${LARGURA}`);
  return buf;
}

const codigos = [...new Set(Object.values(MAPA))].sort();
const imagens = {};
let bytes = 0;
for (const codigo of codigos) {
  const buf = await baixar(codigo);
  bytes += buf.length;
  imagens[codigo] = buf.toString('base64');
}

const bloco = [
  INICIO,
  '    var PAIS_ISO = {',
  Object.keys(MAPA).sort().map((p) => `      ${JSON.stringify(p)}: ${JSON.stringify(MAPA[p])}`).join(',\n'),
  '    };',
  '    var BANDEIRA_WEBP = {',
  codigos.map((c) => `      ${JSON.stringify(c)}: ${JSON.stringify(imagens[c])}`).join(',\n'),
  '    };',
  '    ' + FIM,
].join('\n');

// O repositório é clonado no Windows com core.autocrlf=true, então o arquivo em disco tem CRLF
// enquanto o que está no git tem LF. Comparar e escrever texto cru faria o --check acusar
// "desatualizado" para sempre, e escrever o bloco em LF deixaria o arquivo com finais de linha
// misturados. Por isso: compara normalizado, escreve no final de linha que o arquivo já usa.
const bruto = fs.readFileSync('index.html', 'utf8');
const usaCrlf = (bruto.match(/\r\n/g) || []).length > (bruto.match(/(?<!\r)\n/g) || []).length;
const html = bruto.replace(/\r\n/g, '\n');

const i = html.indexOf(INICIO);
const f = html.indexOf(FIM);
if (i < 0 || f < 0) throw new Error('marcadores BANDEIRAS não encontrados no index.html');

const novo = html.slice(0, i) + bloco + html.slice(f + FIM.length);
const resumo = `${codigos.length} bandeiras · ${(bytes / 1024).toFixed(1)}KB em WebP · ${(bytes * 4 / 3 / 1024).toFixed(1)}KB embutidas`;

if (process.argv.includes('--check')) {
  console.log(novo === html ? `em dia — ${resumo}` : `DESATUALIZADO — rode sem --check (${resumo})`);
  process.exit(novo === html ? 0 : 1);
}

fs.writeFileSync('index.html', usaCrlf ? novo.replace(/\n/g, '\r\n') : novo, 'utf8');
console.log(`index.html atualizado — ${resumo}`);
