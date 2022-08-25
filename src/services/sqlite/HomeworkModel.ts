import db from "./SQLiteDatabase";
import uuid from 'react-native-uuid'
import moment from "moment";
export interface IHomework {
  id: string,
  title: string,
  subject_tagName: string,
  category: string,
  deadline_date: any,
  description: string,
  completed: boolean | number
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
const create = (obj: Omit<IHomework, 'id' | 'completed'>) => {
  const id = uuid.v4() as string
  return new Promise<string>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
       `INSERT INTO homeworks (
          id, 
          title, 
          subject_tagName,
          category,
          deadline_date,
          description,
          completed,
          created_at,
          updated_at
         ) values (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
       [id, obj.title, obj.subject_tagName, obj.category, moment(obj.deadline_date).unix(), obj.description, 0, Date.now(), Date.now()],
       //-----------------------
       (_:any, { rowsAffected, insertId}) => {
         if (rowsAffected > 0) {
           console.log(rowsAffected, insertId)
           resolve('Sua atividade para casa foi adicionada com sucesso!')
         } else {
           reject("Houve um erro ao adicionar uma sua atividade, tente novamente")
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
const update = (id: string, obj: Omit<IHomework, 'id' | 'created_at' | 'completed'>) => {
  return new Promise<string>((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "UPDATE homeworks SET title=?, subject_tagName=?, category=?, deadline_date=?, description=?, updated_at=? WHERE id=?;",
        [obj.title, obj.subject_tagName, obj.category, moment(obj.deadline_date).unix(), obj.description, Date.now(), id],
        //-----------------------
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) resolve('A anotação foi editada com sucesso!');
          else reject('Houve um erro a editar a anotação, tente novamente.'); // nenhum registro alterado
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

const getDates = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT id, title, subject_tagName, category, deadline_date, description, completed  FROM homeworks",
        [],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array);
        },
        (_:any, error: any) => {
          reject()
        },
      );
    });
  });
};

const findByDate = (date: number | string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM homeworks WHERE deadline_date = ?",
        [moment(date).unix()],
        //-----------------------
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_:any, error: any) => {
          reject()
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
// const findByBrand = (brand) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       //comando SQL modificável
//       tx.executeSql(
//         "SELECT * FROM subjects WHERE brand LIKE ?;",
//         [brand],
//         //-----------------------
//         (_, { rows }) => {
//           if (rows.length > 0) resolve(rows._array);
//           else reject("Obj not found: brand=" + brand); // nenhum registro encontrado
//         },
//       );
//     });
//   });
// };

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
        "SELECT * FROM homeworks ORDER BY completed ASC, created_at DESC;",
        [],
        //-----------------------
        (_, { rows }) => resolve(rows._array),
      );
    });
  });
};

const markAsClosed = (id: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `UPDATE homeworks SET completed = ? WHERE id=? ;`,
        [1, id],
        //-----------------------
        (_, { rowsAffected }) => {
          resolve(true)
        },
        (_:any, error: any) => {
          console.log(error)
          reject()
        },
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
const remove = (id: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `DELETE FROM homeworks WHERE id=?;`,
        [id],
        //-----------------------
        (_, { rowsAffected }) => {
          resolve('Anotação da agenda excluída com sucesso')
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
  markAsClosed,
  getDates,
  findByDate,
  remove,
};