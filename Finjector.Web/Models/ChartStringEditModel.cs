using Finjector.Core.Domain;
using System.Linq.Expressions;

namespace Finjector.Web.Models
{

//    export interface Coa
//    {
//        id: number;
//  segmentString: string;
//  name: string;
//  chartType: ChartType;
//  folderId?: number;
//  folder?: Folder;
//  updated: Date;
//  teamName: string;
//  canEdit: boolean;
//}

    public class ChartStringEditModel
    {
        public int Id { get; set; }
        public string SegmentString { get; set; } = "";
        public string Name { get; set; } = "";
        public string ChartType { get; set; } = "";
        public int FolderId { get; set; }
        public Folder Folder { get; set; }
        public DateTime Updated { get; set; }
        public string TeamName { get; set; } = "";
        public bool CanEdit { get; set; } = false;

        public static Expression<Func<Coa, ChartStringEditModel>> Projection()
        {
            return coa => new ChartStringEditModel
            {
                Id = coa.Id,
                SegmentString = coa.SegmentString,
                Name = coa.Name,
                ChartType = coa.ChartType,
                FolderId = coa.FolderId,
                Folder = coa.Folder,
                Updated = coa.Updated,
                TeamName = coa.Folder.Team.Name,
                CanEdit = false
            };
        }        
    }


}
