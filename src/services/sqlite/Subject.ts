import db from "./SQLiteDatabase";
import uuid from 'react-native-uuid'
import moment from "moment";
export interface ISubject {
  id: string,
  name: string,
  professor: string,
  average: number,
  classesInAWeek: string,
  tagName: string,
  description: string,
  color: string
}

/**
 * INICIALIZAÇÃO DA TABELA
 * - Executa sempre, mas só cria a tabela caso não exista (primeira execução)
 */
// db.transaction((tx) => {
//   //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
//   //tx.executeSql("DROP TABLE subjects;");
//   //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>

//   tx.executeSql(
//     "CREATE TABLE IF NOT EXISTS subjects (id INTEGER PRIMARY KEY AUTOINCREMENT, brand TEXT, model TEXT, hp INT);"
//   );
// });

/**
 * CRIAÇÃO DE UM NOVO REGISTRO
 * - Recebe um objeto;
 * - Retorna uma Promise:
 *  - O resultado da Promise é o ID do registro (criado por AUTOINCREMENT)
 *  - Pode retornar erro (reject) caso exista erro no SQL ou nos parâmetros.
 */
const create = (obj: Omit<ISubject, 'id' | 'color'>) => {
  const id = uuid.v4() as string
  return new Promise<string>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
       `INSERT INTO subjects (
         id, 
         name, 
         tagName, 
         professor, 
         average, 
         classesInAWeek, 
         description, 
         color,
         created_at,
         updated_at
         ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
       [id, obj.name, obj.tagName, obj.professor, obj.average, obj.classesInAWeek, obj.description, '', Date.now(), Date.now()],
       //-----------------------
       (_:any, { rowsAffected, insertId}) => {
         if (rowsAffected > 0) {
           console.log(rowsAffected, insertId)
           resolve('Sua matéria foi criada com sucesso')
         } else {
           reject("Houve um erro ao adicionar uma matéria, tente novamente")
         };
       },
       (_:any, error: any) => {
         console.log(error)
       },
     );  
   })
  })
}


/**
 * ATUALIZA UM REGISTRO JÁ EXISTENTE
 * - Recebe o ID do registro e um OBJETO com valores atualizados;
 * - Retorna uma Promise:
 *  - O resultado da Promise é a quantidade de registros atualizados;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */
const update = (id: string, obj: Omit<ISubject, 'id' | 'created_at' | 'color'>) => {
  return new Promise<string>((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "UPDATE subject SET name=?, tagName=?, professor=?, description=?, average=?, classesInAWeek=?, updated_at=? WHERE id=?;",
        [obj.name, obj.tagName, obj.professor, obj.description, obj.average, obj.classesInAWeek, Date.now(), id],
        //-----------------------
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) resolve('Disciplina editada com sucesso!');
          else reject('Houve um erro ao editar a disciplina, tente novamente.'); // nenhum registro alterado
        },
      );
    });
  });
};

/**
 * BUSCA UM REGISTRO POR MEIO DO ID
 * - Recebe o ID do registro;
 * - Retorna uma Promise:
 *  - O resultado da Promise é o objeto (caso exista);
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */
const find = (id: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM subjects WHERE id=?;",
        [id],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array[0]);
          else reject("Obj not found: id=" + id); // nenhum registro encontrado
        },
      );
    });
  });
};

/**
 * BUSCA UM REGISTRO POR MEIO DA MARCA (brand)
 * - Recebe a marca do carro;
 * - Retorna uma Promise:
 *  - O resultado da Promise é um array com os objetos encontrados;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL;
 *  - Pode retornar um array vazio caso nenhum objeto seja encontrado.
 */
const findByTagName = (tagName: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM subjects WHERE tagName == ?;",
        [tagName],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array);
          else reject("Obj not found: brand=" + tagName); // nenhum registro encontrado
        },
      );
    });
  });
};

/**
 * BUSCA TODOS OS REGISTROS DE UMA DETERMINADA TABELA
 * - Não recebe parâmetros;
 * - Retorna uma Promise:
 *  - O resultado da Promise é uma lista (Array) de objetos;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL;
 *  - Pode retornar um array vazio caso não existam registros.
 */
const all = () => {
  return new Promise((resolve, reject): any => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM subjects ORDER BY created_at DESC;",
        [],
        //-----------------------
        (_, { rows }) => resolve(rows._array),
      );
    });
  });
};

/**
 * REMOVE UM REGISTRO POR MEIO DO ID
 * - Recebe o ID do registro;
 * - Retorna uma Promise:
 *  - O resultado da Promise a quantidade de registros removidos (zero indica que nada foi removido);
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */
const remove = (table: string, id: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `DELETE FROM ${table} WHERE id=?;`,
        [id],
        //-----------------------
        (_, { rowsAffected }) => {
          resolve(true)
        },
        (_:any, error: any) => {
          reject()
        },
      );
    });
  });
};

export default {
  create,
  update,
  find,
  all,
  findByTagName,
  remove,
};