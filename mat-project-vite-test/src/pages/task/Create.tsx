import React, { FC } from "react"
import { UpdateTaskPageCmp, UpdateTaskPageCmpProps } from "../../components/UpdateTaskPage/UpdateTaskPageCmp";
import { createAuthApiController } from "../../components/Auth/auth";
import { createTask } from "../../api/task/create/create";
import { TaskCreateErrorDetails } from "../../api/dtos/errors/error_response";
import { useNavigate } from "react-router-dom";

interface Props {

}


const defaultSource = `<dokument>
    <popis>
        Popis úlohy.
    </popis>
    <polozky>
        <skupina>
            <zdroje>
                <zdroj>Zdroj 1 pro cvičení v této skupině.</zdroj>
                <zdroj>Zdroj 2 pro cvičení v této skupině.</zdroj>
            </zdroje>
            <clenove>
                <!--
                Cvičení má 2 atributy:
                typ - typ cvičení
                vaha - váha cvičení, při vyhodnocování značí váhu (důležitost) cvičení vzhledem k ostatním cvičením
                -->
                <cviceni typ="Doplnovacka" vaha="10">
                    <instrukce>
                        Instrukce pro tuto doplňovačku.
                    </instrukce>
                    <!--
                    V doplňovačce lze použít 2 komponenty:
                    text input - textový vstup - [správná hodnota]
                    combobox - výběr z možností - [správná možnost/špatná možnost 1/špatná možnost 2]
                    Možnosti nemůžou obsahovat řídící znaky: '[',']','/' (tento znak odděluje možnosti v
                    comboboxu),'\\'.
                    Aby možnosti mohly obsahovat tyto kontrolní znaky, tak se musí před řídícím znakem nacházet zpětné
                    lomítko '\\'.
                    Zpětné lomítko se nesmí nacházet před neřídícím znakem.
                    -->
                    <obsah>
                        černý ryb[í/ý]z, pozorovala pl[y/i]noucí řeku, [z/s]křížit meče,
                        [K]arel IV., l[i/y]dé v c[i/y]z[i]ně občas dávají sv[ý/í]m dětem opravdu podivná
                        jména, jako například [\\[****\\\\Pal2566\\]\\//Pavel]
                    </obsah>
                </cviceni>
                <cviceni typ="OpravovaniChyb" vaha="20">
                    <instrukce>
                        Instrukce pro toto opravování chyb.
                    </instrukce>
                    <!--
                    Opravování chyb se skládá ze dvou částí:
                        správného textu - text, na který musí žák špatný text opravit
                        špatného textu - text, který žák dostane k opravení na správný text
                    Žák dostane špatný text a musí ho opravit tak, aby byl stejný jako správný text, který nevidí.
        
                    Hodnocení:
                    Hodnotí se, jak moc se opravený text liší od správného textu, čím jsou si podobnější, tím více bodů
                    dostane.
                    Pokud se opravený text od správného textu liší více nebo stejně jako zadaný text, tak bude uděleno
                    0 bodů.
                    -->
                    <obsah>
                        <spravnyText>
                            Šli jsme k panu starostovi pro radu.
                        </spravnyText>
                        <text>
                            Sli sme k panu starostu pro radu.
                        </text>
                    </obsah>
                </cviceni>
                <skupina>
                    <zdroje>
                        <zdroj>
                            Zdroj pro cvičení v této vnořené skupině.
                        </zdroj>
                    </zdroje>
                    <clenove>
                        <cviceni typ="Doplnovacka" vaha="5">
                            <instrukce>Instrukce pro tuto doplňovačku ve vnořené skupině.</instrukce>
                            <obsah>
                                Skákal [p/l]es přes [o/vo]ves a přes zelenou louku...
                            </obsah>
                        </cviceni>
                    </clenove>
                </skupina>
            </clenove>
        </skupina>
        <cviceni typ="Doplnovacka" vaha="3">
            <instrukce>
                Instrukce pro tuto doplňovačku.
            </instrukce>
            <obsah>
                černý ryb[í/ý]z, pozorovala pl[y/i]noucí řeku, [z/s]křížit meče,
                [K]arel IV., l[i/y]dé v c[i/y]z[i]ně občas dávají sv[ý/í]m dětem opravdu podivná
                jména, jako například [\\[****\\\\Pal2566\\]\\//Pavel]
            </obsah>
        </cviceni>
    </polozky>
</dokument>
`;

const createTaskControl = createAuthApiController();
const getInitialSource = ()=>defaultSource;

const Create: FC<Props> = () => {

    const navigate = useNavigate();

    const action = React.useCallback<UpdateTaskPageCmpProps['action']>(async({name,display,difficulty,classRange,isPublic,source,tags}) =>{

        if(!source || source.length < 1){
            return {
                generalError:true,
                value:{
                message:'Task source cannot be empty.'
                }
            };
        }
        
       const response = await createTask({
        task:{
            name,
            display,
            difficulty,
            class_range:classRange,
            is_public:isPublic,
            source,
            tags:tags as [string,...string[]]
        }
        },
        createTaskControl
        );
        if(response.success){
            navigate(`/task/${response.body.data.taskId}/myDetail`);
        }
        else if(response.isServerError){
            if(response.error?.error?.details?.code === 1 satisfies TaskCreateErrorDetails['code']){
                const data = response.error.error.details.errorData;
                const classRangeError = {
                    error:undefined as (string|undefined),
                    minError:undefined as (string|undefined),
                    maxError:undefined as (string|undefined)
                };
                const apiClassRangeError = data.class_range?.error;
                if(apiClassRangeError){
                if(apiClassRangeError === 'min_max_swapped'){
                    classRangeError.error = "Min should be less than or equal to max.";
                }
                else{
                    if(apiClassRangeError?.invalidMin){
                        classRangeError.minError = "Invalid class selected.";
                    }
                    if(apiClassRangeError?.invalidMax){
                        classRangeError.maxError = "Invalid class selected.";
                    }
                }
            }
                return {
                    generalError:false,
                    value:{
                        isFormError:true,
                        error:{
                            name:data.name?.message,
                            difficulty:data.difficulty?.message,
                            tags:data.tags?.message,
                            classRange:classRangeError
                        }
                    }
                };
            }
            return {
                generalError:false,
                value:{
                    isFormError:false,
                    error:{
                    status:response.status,
                    statusText:response.statusText,
                    error:response.error?.error
                    }
                }
            };
        }
        return undefined;
    },[navigate]);
   
    return (
        <UpdateTaskPageCmp
        getInitialSource={getInitialSource}
        actionLabel={'Vytvořit'}
        action={action}
         />
    );
};

export { Create, type Props as CreateProps };
